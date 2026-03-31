import { google, gmail_v1 } from "googleapis";

type BookingInfo = {
    撮影日: string;
    商品: string;
    場所: string;
    新郎: string;
    新婦: string;
    };

type FetchArgs = {
    email: string;
    refreshToken: string;
    yearMonth: string; // "yyyy-mm"
};

function parseYearMonth(yearMonth: string): { year: number; month: number } {
    const match = yearMonth.match(/^(\d{4})-(\d{2})$/);
    if (!match) {
        throw new Error(`yearMonth must be yyyy-mm. received: ${yearMonth}`);
    }

    const year = Number(match[1]);
    const month = Number(match[2]);

    if (month < 1 || month > 12) {
        throw new Error(`month must be 01-12. received: ${yearMonth}`);
    }

    return { year, month };
}

function formatDateToISO(dateText: string): string {
    const match = dateText.match(/(\d{4})年(\d{2})月(\d{2})日/)
    if (!match) return dateText

    const year = match[1]
    const month = match[2]
    const day = match[3]

    return `${year}-${month}-${day}`
}

function getTargetRange(yearMonth: string): {
    start: Date;
    end: Date;
    monthNumbers: number[];
    } 
    {
    const { year, month } = parseYearMonth(yearMonth);

    // 指定月の前月1日 00:00:00
    const start = new Date(year, month - 2, 1);
    // 指定月の翌々月1日 00:00:00
    // after:start / before:end にすると「前月〜翌月末」まで含められる
    const end = new Date(year, month + 1, 1);

    const prev = new Date(year, month - 2, 1);
    const curr = new Date(year, month - 1, 1);
    const next = new Date(year, month, 1);

    return {
        start,
        end,
        monthNumbers: [
        prev.getMonth() + 1,
        curr.getMonth() + 1,
        next.getMonth() + 1,
        ],
    };
}

function isSameYearMonth(dateStr: string, yearMonth: string): boolean {
    // dateStr: "2026-03-15"
    return dateStr.startsWith(yearMonth);
}

function formatDateForGmailQuery(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
}

function decodeBase64Url(data?: string): string {
    if (!data) return "";
    const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(normalized, "base64").toString("utf-8");
}

function extractPlainTextFromPayload(payload?: gmail_v1.Schema$MessagePart): string {
    if (!payload) return "";

    // 単一パート
    if (payload.mimeType === "text/plain" && payload.body?.data) {
        return decodeBase64Url(payload.body.data);
    }

    // multipart 再帰探索
    if (payload.parts?.length) {
        for (const part of payload.parts) {
        const text = extractPlainTextFromPayload(part);
        if (text.trim()) return text;
        }
    }

    // 最後の保険
    if (payload.body?.data) {
        return decodeBase64Url(payload.body.data);
    }

    return "";
}

function normalizeText(text: string): string {
    return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function stripRomanizedName(nameLine: string): string {
    // 例: "天野悠佑 Amano Yusuke" -> "天野悠佑"
    return nameLine.replace(/\s+[A-Za-z][A-Za-z\s'.-]*$/u, "").trim();
}

function parseBlocks(body: string): BookingInfo[] {
    const normalized = normalizeText(body);

    const blocks = normalized
        .split(/=+\n+/)
        .map((b) => b.trim())
        .filter(Boolean);

    const results: BookingInfo[] = [];

    for (const block of blocks) {
        const shootDate = block.match(/撮影日：([0-9]{4}年[0-9]{2}月[0-9]{2}日)/);
        const place = block.match(/場所：([^\n]+)/);
        const groom = block.match(/新郎：([^\n]+)/);
        const bride = block.match(/新婦：([^\n]+)/);
        const productBlock = block.match(/商品：([\s\S]*?)場所：/);

        if (!shootDate || !place || !groom || !bride || !productBlock) continue;

        const productLines = extractProductLines(productBlock[1]);

        results.push({
            撮影日: formatDateToISO(shootDate[1].trim()),
            商品: productLines[0] ?? '',
            場所: place[1].trim(),
            新郎: stripRomanizedName(groom[1]),
            新婦: stripRomanizedName(bride[1]),
        });
    }

    return results;
}

function extractProductLines(productText: string): string[] {
    const lines = productText
        .split('\n')
        .map(line => line.replace(/^[\s　]+/, '').trim())
        .filter(Boolean)

    // []ありを優先抽出
    const bracketProducts = lines
        .filter(line => line.includes('['))
        .map(line => line.split('[')[0].trim())
        .filter(Boolean)

    if (bracketProducts.length > 0) {
        return bracketProducts
    }

    // []が無い場合 → 1行目だけ採用
    return [lines[0]]
}


function uniqueByKey(items: BookingInfo[]): BookingInfo[] {
    const map = new Map<string, BookingInfo>();

    for (const item of items) {
        const key = `${item.撮影日}__${item.商品}__${item.場所}__${item.新郎}__${item.新婦}`;
        if (!map.has(key)) {
        map.set(key, item);
        }
    }

    return [...map.values()].sort((a, b) => a.撮影日.localeCompare(b.撮影日, "ja"));
}

function buildMonthDayQuery(monthNumbers: number[]): string {
    // 例:
    // ("3/1の" OR "3/2の" ... OR "3/31の" OR "4/1の" ... ) "了解です"
    const pieces: string[] = [];

    for (const month of monthNumbers) {
        for (let day = 1; day <= 31; day++) {
        pieces.push(`"${month}/${day}の"`);
        }
    }

    return `(${pieces.join(" OR ")}) "了解です"`;
}

function createGmailClient(refreshToken: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Google OAuth env is missing");
    }

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret
    );

    oauth2Client.setCredentials({
        refresh_token: refreshToken,
    });

    return google.gmail({
        version: "v1",
        auth: oauth2Client,
    });
}

export async function fetchAcceptedBookingsFromSentMail(
    args: FetchArgs
    ): Promise<BookingInfo[]> {
    const gmail = createGmailClient(args.refreshToken);
    const { start, end, monthNumbers } = getTargetRange(args.yearMonth);

    const after = formatDateForGmailQuery(start);
    const before = formatDateForGmailQuery(end);

  // in:sent で送信済みメールに限定
  // from: 自分自身 を併用してもよい
    const q = [
        "in:sent",
        `after:${after}`,
        `before:${before}`,
        buildMonthDayQuery(monthNumbers),
    ].join(" ");

    const messageIds: string[] = [];
    let pageToken: string | undefined = undefined;

    do {
        const listRes = await gmail.users.messages.list({
        userId: "me",
        q,
        pageToken,
        maxResults: 100,
        });

        const messages = listRes.data.messages ?? [];
        for (const msg of messages) {
        if (msg.id) messageIds.push(msg.id);
        }

        pageToken = listRes.data.nextPageToken ?? undefined;
    } while (pageToken);

    if (messageIds.length === 0) {
        return [];
    }

    const results: BookingInfo[] = [];

    for (const messageId of messageIds) {
        const msgRes = await gmail.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
        });

        const fullText = extractPlainTextFromPayload(msgRes.data.payload);
        if (!fullText.trim()) continue;

        // 「了解です」の自分の返信本文に、元メールが引用されている前提
        if (!fullText.includes("了解です")) continue;

        const parsed = parseBlocks(fullText);
        results.push(...parsed);
    }

    const filtered = results.filter(item =>
    isSameYearMonth(item.撮影日, args.yearMonth)
    );

return uniqueByKey(filtered);
}
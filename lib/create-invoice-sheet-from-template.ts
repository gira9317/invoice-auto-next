import { google } from 'googleapis'
import { buildMergedInvoiceData } from '@/lib/build-merged-invoice-data'
import { loadSheet } from '@/lib/load-sheet'

type CreateInvoiceSheetParams = {
    spreadsheetId: string          // ユーザー設定の元データ用スプレッドシートID
    refreshToken: string
    yearMonth: string              // "2026-03"
    email: string
}



function parseYearMonth(yearMonth: string) {
    const [yearStr, monthStr] = yearMonth.split('-')
    const year = Number(yearStr)
    const month = Number(monthStr)

    if (!year || !month || month < 1 || month > 12) {
        throw new Error(`yearMonthの形式が不正です: ${yearMonth}`)
    }

    return { year, month }
}

function getLastDayOfMonth(year: number, month: number) {
    // monthは1-12想定
    return new Date(year, month, 0)
}

function pad2(value: number) {
    return String(value).padStart(2, '0')
}

function formatMonthDay(dateText: string) {
    // booking.撮影日 は "yyyy-mm-dd"形式 
        const d = new Date(dateText)
        if (Number.isNaN(d.getTime())) return dateText
        return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`
}

function buildSafeFileName(params: {
    year: number
    month: number
    lastDay: Date
    userName: string
    grandTotal: number
}) {
    const { year, month, lastDay, userName, grandTotal } = params

    
    const y = lastDay.getFullYear()
    const m = pad2(lastDay.getMonth() + 1)
    const d = pad2(lastDay.getDate())

    return `${y}${m}${d}_${userName}_${grandTotal.toLocaleString()}円_${year}年${pad2(month)}月業務委託_請求書`
}


export async function createInvoiceSheetFromTemplate({
    spreadsheetId,
    refreshToken,
    yearMonth,
    email,
}: CreateInvoiceSheetParams) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({ refresh_token: refreshToken })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })
    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })

    // 1. 請求書データ作成
    const merged = await buildMergedInvoiceData(
        spreadsheetId,
        refreshToken,
        yearMonth,
        email
    )

    // 2. ユーザー情報取得
    const sheetData = await loadSheet(spreadsheetId, refreshToken)
    const user = sheetData.user

    const { year, month } = parseYearMonth(yearMonth)
    const lastDay = getLastDayOfMonth(year, month)

    // テンプレートのスプレッドシートID
    const templateSpreadsheetId = '1P4VCDf1Fx3DkoxDYGk9yusJEDU-6Nug95rgWx3cWQ-M'

    const fileName = buildSafeFileName({
        year,
        month,
        lastDay,
        userName: user.userName,
        grandTotal: merged.grandTotal,
    })

    // 3. テンプレをユーザーDriveにコピー
    const copyRes = await drive.files.copy({
        fileId: templateSpreadsheetId,
        requestBody: {
            name: fileName,
        },
        fields: 'id,name,webViewLink',
    })

    const newSpreadsheetId = copyRes.data.id

    if (!newSpreadsheetId) {
        throw new Error('テンプレートのコピーに失敗しました')
    }

    // 4. ヘッダ・固定項目
    const fixedRanges = [
        {
        range: '請求書1!B2',
        values: [[year]],
        },
        {
        range: '請求書1!D2',
        values: [[month]],
        },
        {
        range: '請求書1!L5',
        values: [[user.postalCode]],
        },
        {
        range: '請求書1!L6',
        values: [[user.address]],
        },
        {
        range: '請求書1!L8',
        values: [[user.userName]],
        },
        {
        range: '請求書1!D35',
        values: [[user.bankName]],
        },
        {
        range: '請求書1!D36',
        values: [[user.bankBranchName]],
        },
        {
        range: '請求書1!D37',
        values: [[user.accountType]],
        },
        {
        range: '請求書1!D38',
        values: [[user.accountHolderName]],
        },
        {
        range: '請求書1!D39',
        values: [[user.accountNumber]],
        },
    ]

  // 5. 12行目から明細
    const detailValues = merged.rows.map((row) => [
        formatMonthDay(row.date),
        row.venueName,
        '',
        '',
        row.banquetName,
        row.productName,
        row.productPrice,
        row.route,
        '',
        '',
        row.transportationCost,
        row.otherItemName,
        row.otherItemPrice,
    ])

    const allData = [...fixedRanges]

    if (detailValues.length > 0) {
        allData.push({
        range: `請求書1!B12:N${11 + detailValues.length}`,
        values: detailValues,
        })
    }

    // 6. 一括書き込み
    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: newSpreadsheetId,
        requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: allData,
        },
    })

    return {
        spreadsheetId: newSpreadsheetId,
        fileName: copyRes.data.name,
        url: copyRes.data.webViewLink,
        grandTotal: merged.grandTotal,
        rowCount: merged.rows.length,
    }
}
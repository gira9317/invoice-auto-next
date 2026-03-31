import { google } from 'googleapis'

function toNumber(value: string | number | undefined) {
    if (value == null) return 0

    return Number(
        String(value)
            .replace(/,/g, '')
            .replace(/[¥￥]/g, '')
            .replace(/円/g, '')
            .trim()
    ) || 0
}

function normalizeText(text: string) {
    return String(text)
        .trim()
        .replace(/[\s　]+/g, '')
}

export async function loadSheet(
    spreadsheetId: string,
    refresh_token: string
) {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({ refresh_token })

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })

    const userRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'ユーザー情報!B2:B',
    })

    const userValues = userRes.data.values ?? []

    console.log('=== userValues raw ===')
    console.log(userValues)

    const userName = userValues[0]?.[0] ?? ''
    const postalCode = userValues[1]?.[0] ?? ''
    const address = userValues[2]?.[0] ?? ''
    const bankName = userValues[3]?.[0] ?? ''
    const bankBranchName = userValues[4]?.[0] ?? ''
    const accountType = userValues[5]?.[0] ?? ''
    const accountNumber = userValues[6]?.[0] ?? ''
    const accountHolderName = userValues[7]?.[0] ?? ''

    const invoiceRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: '金額情報!A2:K',
    })

    const values = invoiceRes.data.values ?? []

    console.log('=== 金額情報 raw values ===')
    console.log(values)

    // 交通費リスト
    const transportationList = values
        .filter(row => row[0])
        .map(row => ({
            venueName: row[0] ?? '',
            route: row[1] ?? '',
            transportationCost: toNumber(row[2]),
        }))

    // 商品リスト
    const productList = values
        .filter(row => row[5])
        .map(row => ({
            productName: row[5] ?? '',
            productPrice: toNumber(row[6]),
        }))

    // その他リスト
    const otherList = values
        .filter(row => row[9])
        .map(row => ({
            otherItemName: row[9] ?? '',
            otherItemPrice: toNumber(row[10]),
        }))

    console.log('=== transportationList parsed ===')
    console.log(transportationList)

    console.log('=== productList parsed ===')
    console.log(productList)

    console.log('=== otherList parsed ===')
    console.log(otherList)

    console.log('=== transportationList normalized ===')
    console.log(
        transportationList.map(item => ({
            original: item.venueName,
            normalized: normalizeText(item.venueName),
            route: item.route,
            cost: item.transportationCost,
        }))
    )

    console.log('=== productList normalized ===')
    console.log(
        productList.map(item => ({
            original: item.productName,
            normalized: normalizeText(item.productName),
            price: item.productPrice,
        }))
    )

    return {
        user: {
            userName,
            postalCode,
            address,
            bankName,
            bankBranchName,
            accountType,
            accountNumber,
            accountHolderName,
        },
        invoice: {
            transportationList,
            productList,
            otherList,
        },
    }
}
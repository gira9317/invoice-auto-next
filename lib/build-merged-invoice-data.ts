import { loadSheet } from '@/lib/load-sheet'
import { fetchAcceptedBookingsFromSentMail } from '@/lib/load-email'

type InvoiceRow = {
    date: string
    venueName: string
    banquetName: string
    productName: string
    productPrice: number
    route: string
    transportationCost: number
    otherItemName: string
    otherItemPrice: number
    total: number
}

type MergedInvoiceResult = {
    rows: InvoiceRow[]
    grandTotal: number
}

function normalizeText(text: string) {
    return text.trim().replace(/\s+/g, '')
}

export async function buildMergedInvoiceData(
    spreadsheetId: string,
    refreshToken: string,
    yearMonth: string,
    email: string
): Promise<MergedInvoiceResult> {
    const sheetData = await loadSheet(spreadsheetId, refreshToken)
    const bookings = await fetchAcceptedBookingsFromSentMail({
        email,
        refreshToken,
        yearMonth,
    })

    const { transportationList, productList, otherList } = sheetData.invoice

    const totalOtherItemPrice = otherList.reduce(
        (sum, item) => sum + (item.otherItemPrice ?? 0),
        0
    )

    const rows: InvoiceRow[] = bookings.map((booking) => {
        const matchedTransport = transportationList.find(
            (item) => normalizeText(item.venueName) === normalizeText(booking.場所)
        )

        const hasProduct = normalizeText(booking.商品) !== ''

        const matchedProduct = productList.find(
            (item) => normalizeText(item.productName) === normalizeText(booking.商品)
)


        const numericProductPrice = hasProduct
            ? (matchedProduct?.productPrice ?? 0)
            : 0

        const productPrice = matchedProduct?.productPrice ?? 0

        const transportationCost = matchedTransport?.transportationCost ?? 0

        const allOtherItemNames = otherList
            .map(item => item.otherItemName)
            .filter(Boolean)
            .join('・')

        const otherItemPrice = totalOtherItemPrice

        return {
            date: booking.撮影日,
            venueName: booking.場所,
            banquetName: `${booking.新郎}・${booking.新婦}様`,
            productName: booking.商品,
            productPrice,
            route: matchedTransport?.route ?? '',
            transportationCost,
            otherItemName: allOtherItemNames,
            otherItemPrice: totalOtherItemPrice,
            total: productPrice + transportationCost + totalOtherItemPrice,
        }
    })

    const grandTotal = rows.reduce((sum, row) => sum + row.total, 0)

    return {
        rows,
        grandTotal,
    }
}
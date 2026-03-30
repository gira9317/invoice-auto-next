import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req:Request){
    try {
        const body = await req.json()
        const { id, sheet_url } = body

        if(!id || !sheet_url){
            return NextResponse.json(
                            { success: false, message: 'id or sheet_url is missing' },
                            { status: 400 }
                        )
        }

        const { error } = await supabaseAdmin
        .from("profiles")
        .upsert(
            {id,settings_sheet_url: sheet_url},
            {onConflict:"id"})

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { success: true, message: "saved successfully" },
            { status: 200 }
        );
    }catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, message: "server error" },
            { status: 500 }
        );
    }
}
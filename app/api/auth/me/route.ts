import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const me = await getAuth()
        return NextResponse.json( {ok : true ,userId : me});
    } catch {
        return NextResponse.json({ok : false});
    }
}
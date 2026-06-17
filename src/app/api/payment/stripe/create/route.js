import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/getAuthUser';

export async function POST(){

   return NextResponse.json({
      ok:true
   });

}
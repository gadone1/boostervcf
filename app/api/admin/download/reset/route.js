import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import User from '../../../../../models/User';

export async function POST() {
  try {
    await dbConnect();

    // Reset all downloaded users to undownloaded
    const result = await User.updateMany(
      { isDownloaded: true },
      { $set: { isDownloaded: false } }
    );

    return NextResponse.json({ message: `Reset ${result.modifiedCount} users to undownloaded status.` }, { status: 200 });
  } catch (error) {
    console.error('Error resetting downloaded status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
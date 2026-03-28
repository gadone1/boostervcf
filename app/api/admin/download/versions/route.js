import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET() {
  try {
    await dbConnect();

    const versions = await User.aggregate([
      { $match: { downloadVersion: { $gt: 0 } } },
      { $group: { _id: '$downloadVersion', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    return NextResponse.json({ versions: versions.map((v) => ({ version: v._id, count: v.count })) }, { status: 200 });
  } catch (error) {
    console.error('Error fetching version history:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
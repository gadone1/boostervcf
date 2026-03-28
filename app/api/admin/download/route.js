import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import Counter from '../../../../models/Counter';

export async function GET() {
  try {
    await dbConnect();

    // Find all not-yet-downloaded users (downloadVersion 0)
    const undownloadedUsers = await User.find({ downloadVersion: 0 }).sort({ createdAt: -1 });

    if (undownloadedUsers.length === 0) {
      return NextResponse.json({ message: 'No new numbers available for download' }, { status: 404 });
    }

    // Get next download version counter
    const counter = await Counter.findOneAndUpdate(
      { name: 'downloadVersion' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const version = counter.value;

    // Assign version to this batch
    await User.updateMany(
      { _id: { $in: undownloadedUsers.map((user) => user._id) } },
      { $set: { downloadVersion: version } }
    );

    // Generate VCF content for the just-assigned batch
    let vcfContent = '';
    undownloadedUsers.forEach((user) => {
      vcfContent += `BEGIN:VCARD\n`;
      vcfContent += `VERSION:3.0\n`;
      vcfContent += `FN:${user.username}\n`;
      vcfContent += `TEL;TYPE=CELL:${user.phoneNumber}\n`;
      vcfContent += `END:VCARD\n\n`;
    });

    const res = new NextResponse(vcfContent, { status: 200 });
    res.headers.set('Content-Type', 'text/vcard');
    res.headers.set('Content-Disposition', `attachment; filename="contacts_v${version}.vcf"`);

    return res;
  } catch (error) {
    console.error('Error generating VCF:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
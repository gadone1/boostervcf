import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import User from '../../../../../models/User';

export async function GET() {
  try {
    await dbConnect();

    // Find all downloaded users (versioned)
    const downloadedUsers = await User.find({ downloadVersion: { $gt: 0 } }).sort({ createdAt: -1 });

    // Generate VCF content
    let vcfContent = '';
    downloadedUsers.forEach((user) => {
      vcfContent += `BEGIN:VCARD\n`;
      vcfContent += `VERSION:3.0\n`;
      vcfContent += `FN:${user.username}\n`;
      vcfContent += `TEL;TYPE=CELL:${user.phoneNumber}\n`;
      vcfContent += `END:VCARD\n\n`;
    });

    const res = new NextResponse(vcfContent, { status: 200 });
    res.headers.set('Content-Type', 'text/vcard');
    res.headers.set('Content-Disposition', 'attachment; filename="downloaded_contacts.vcf"');

    return res;
  } catch (error) {
    console.error('Error generating VCF:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DonationData {
  donorName: string;
  phone?: string;
  email: string;
  dedication?: string;
}

interface DonationItem {
  donationType: 'product' | 'general';
  productId?: string; 
  quantity?: number;
  amount?: number;
  totalAmount: number; 
}

export async function createDonation(donationData: DonationData, donationItems: DonationItem[]) {
  console.log('Creating donation...');
  const donation = await prisma.donations.create({
    data: {
      donor_name: donationData.donorName,
      phone: donationData.phone,
      email: donationData.email,
      dedication: donationData.dedication,
    },
  });

  await prisma.donation_items.createMany({
    data: donationItems.map(item => ({
      donation_id: donation.id, 
      donation_type: item.donationType,
      product_id: item.productId,
      quantity: item.quantity,
      amount: item.amount,
      total_amount: item.totalAmount,
    })),
  });

  return donation;
}

export async function getProducts() {
  console.log('Fetching products...');
  const products = await prisma.products.findMany();
  return products;
}
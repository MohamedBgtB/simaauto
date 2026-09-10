import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FEATURES = [
  "ABS", "Adaptive cornering lights", "Adaptive Cruise Control", "Alloy wheels", "Ambient lighting",
  "Android Auto", "Apple CarPlay", "Arm rest", "Autom. dimming interior mirror", "Bluetooth",
  "Central locking", "DAB radio", "Digital cockpit", "Distance warning system", "Electric seat adjustment",
  "Electric side mirror", "Electric tailgate", "Electric windows", "Emergency brake assist", "Emergency call system",
  "Folding exterior mirrors", "Four-wheel drive", "Full Service History", "Glare-free high beam headlights",
  "Hands-free kit", "Headlight washer system", "Heated seats", "Heated steering wheel", "High beam assist",
  "Hill-start assist", "Immobilizer", "Induction charging for smartphones", "Integrated music streaming",
  "Isofix", "Keyless central locking", "Lane change assist", "Leather steering wheel", "LED headlights",
  "LED running lights", "Light sensor", "Lumbar support", "Multifunction steering wheel", "Navigation system",
  "Non-smoker vehicle", "On-board computer", "Paddle shifters", "Panoramic roof", "Power Assisted Steering",
  "Rain sensor", "Sound system", "Speed limit control system", "Sport seats", "Sports package",
  "Sports suspension", "Start-stop system", "Summer tyres", "Sunroof", "Tinted windows",
  "Touchscreen", "Traction control", "Traffic sign recognition", "Trailer coupling, swiveling",
  "Tyre pressure monitoring", "USB port",
];

async function main() {
  // Features master list
  for (const name of FEATURES) {
    await prisma.feature.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Admin account
  const email = process.env.ADMIN_EMAIL || "admin@simaauto.ma";
  const password = process.env.ADMIN_PASSWORD || "change-this-password";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  // Sample vehicle (skip if one already exists)
  const existing = await prisma.vehicle.findUnique({ where: { reference: "SA-2020-Q3" } });
  if (!existing) {
    const images = [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    ];

    const vehicle = await prisma.vehicle.create({
      data: {
        reference: "SA-2020-Q3",
        make: "Audi",
        modelRange: "Q3 (F3B)(11.2018->)",
        trimLine: "40 TFSI quattro S line S-Line Sline Sport",
        priceDh: 380000,
        mileageKm: 99000,
        firstRegistration: "01/2020",
        status: "Disponible",
        featured: true,
        mainImageUrl: images[0],
        description: "Véhicule en état impeccable. Carnet d'entretien à jour chez la maison. Origine Allemagne.",
        technicalData: {
          create: {
            vehicleCondition: "Used vehicle, Accident-free",
            category: "SUV/Off-road Vehicle/Pickup Truck",
            origin: "German edition",
            ownersCount: 2,
            cubicCapacity: "1,984 ccm",
            power: "140 kW (190 hp)",
            driveType: "Internal combustion engine",
            fuel: "Petrol",
            energyConsumption: "7.5 l/100km",
            co2Emissions: "171 g/km",
            transmission: "Automatic",
            emissionClass: "Euro6d-TEMP",
            emissionsSticker: "4 (Green)",
            seatsCount: 5,
            doorCount: "4/5",
            climatisation: "Automatic climatisation, 3 zones",
            parkingSensors: "Rear, Front, Camera",
            airbags: "Front and Side and More Airbags",
            manufacturerColour: "Turboblau",
            colour: "Blue Metallic",
            interiorDesign: "Part leather, Black",
            weight: "1,695 kg",
            cylinders: 4,
            tankCapacity: "60 l",
            trailerLoadBraked: "2,100 kg",
            trailerLoadUnbraked: "750 kg",
          },
        },
        gallery: {
          create: images.map((url, i) => ({ imageUrl: url, displayOrder: i, isHero: i === 0 })),
        },
      },
    });

    const featureNames = [
      "ABS", "Adaptive Cruise Control", "Alloy wheels", "Ambient lighting", "Android Auto",
      "Apple CarPlay", "Arm rest", "Bluetooth", "Central locking", "Digital cockpit",
      "Distance warning system", "Electric seat adjustment", "Electric side mirror", "Electric tailgate",
      "Four-wheel drive", "Full Service History", "Hands-free kit", "Heated seats", "Isofix",
      "Keyless central locking", "Leather steering wheel", "LED headlights", "LED running lights",
      "Light sensor", "Multifunction steering wheel", "Navigation system", "Paddle shifters",
      "Panoramic roof", "Rain sensor", "Sound system", "Sport seats", "Sports package",
      "Sports suspension", "Start-stop system", "Tinted windows", "Touchscreen", "Traction control", "USB port",
    ];
    const features = await prisma.feature.findMany({ where: { name: { in: featureNames } } });
    await prisma.vehicleFeature.createMany({
      data: features.map((f) => ({ vehicleId: vehicle.id, featureId: f.id })),
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

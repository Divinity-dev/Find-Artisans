import HomePage from "../components/Homepage";

async function getWorkers() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/workers/all`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.workers || [];
  } catch (error) {
    console.error("Failed to fetch workers:", error);
    return [];
  }
}

export default async function Page() {

    const workers = await getWorkers();

    return (
        <HomePage workers={workers} />
    );
}

export const metadata = {
  title: "FindArtisans | Hire Trusted Artisans in Nigeria",

  description:
    "Find verified electricians, plumbers, mechanics, cleaners, and skilled professionals across Nigeria.",

  alternates: {
    canonical: "https://findartisans.com",
  },

  openGraph: {
    title: "FindArtisans",
    description:
      "Hire trusted artisans across Nigeria.",
    url: "https://findartisans.com",
    siteName: "FindArtisans",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FindArtisans",
    description: "Hire trusted artisans across Nigeria.",
    images: ["/images/og-image.jpg"],
  },
};
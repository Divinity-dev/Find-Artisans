import WorkersPage from "./workerspage";

async function getWorkers(page = 1) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/workers/all?page=${page}&limit=12`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    return {
      workers: [],
      totalPages: 1,
      page: 1,
    };
  }

  return res.json();
}

export default async function Page({ searchParams }) {
  const params = await searchParams;

  const page = Number(params.page || 1);

  const data = await getWorkers(page);

  return (
    <WorkersPage
      workers={data.workers}
    />
  );
}

export const metadata = {
  title: "Browse Verified Artisans & Skilled Workers in Nigeria | FindArtisans",
  description:
    "Browse verified electricians, plumbers, mechanics, carpenters, painters, cleaners, and other skilled artisans across Nigeria. Filter by state, city, and local government to find trusted professionals near you.",
  keywords: [
    "artisans Nigeria",
    "verified artisans",
    "find workers Nigeria",
    "electricians",
    "plumbers",
    "mechanics",
    "carpenters",
    "cleaners",
    "painters",
    "FindArtisans",
  ],
 alternates: {
  canonical: "https://find-artisans.com/workers",
},
};
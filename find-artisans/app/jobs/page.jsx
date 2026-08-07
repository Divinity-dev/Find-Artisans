import JobsPage from "./jobspage";

async function getJobs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    const result = await res.json();

    return result.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function Page() {
  const jobs = await getJobs();

  return <JobsPage jobs={jobs} />;
}

export const metadata = {
  title: "Jobs | FindArtisans",

  description:
    "Browse artisan jobs across Nigeria. Apply for electrician, plumbing, painting, cleaning, mechanic, carpentry and other skilled jobs.",

  alternates: {
    canonical: "https://findartisans.com/jobs",
  },

  openGraph: {
    title: "Find Artisan Jobs in Nigeria | FindArtisans",
    description:
      "Browse verified jobs posted by customers across Nigeria.",
    url: "https://findartisans.com/jobs",
    siteName: "FindArtisans",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Find Artisan Jobs in Nigeria",
    description:
      "Browse verified artisan jobs across Nigeria.",
  },
};
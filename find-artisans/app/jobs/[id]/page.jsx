import JobDetailsPage from "./JobDetailsPage";

async function getJob(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    return null;
  }

  const result = await res.json();

  return result.data;
}

export default async function Page({ params }) {
  const { id } = await params;

  const job = await getJob(id);

  if (!job) {
    return <div>Job not found</div>;
  }

  return <JobDetailsPage job={job} id={id} />;
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (!res.ok) {
    return {
      title: "Job | FindArtisans",
    };
  }

  const result = await res.json();

  const job = result.data;

  return {
    title: `${job.title} | FindArtisans`,

    description:
      job.description.slice(0, 160),

    alternates: {
      canonical: `https://findartisans.com/jobs/${id}`,
    },

    openGraph: {
      title: job.title,
      description: job.description.slice(0, 160),
      url: `https://findartisans.com/jobs/${id}`,
      images: [
        {
          url:
            job.images?.[0] ||
            "/images/default-job.jpg",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: job.title,
      description: job.description.slice(0, 160),
      images: [
        job.images?.[0] ||
          "/images/default-job.jpg",
      ],
    },
  };
}
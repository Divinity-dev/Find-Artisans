import Workerprofile from "./workerprofile";

async function getWorker(id) {
  const [workerRes, reviewRes, jobsRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        next: { revalidate: 300 },
      }
    ),

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews/worker/${id}`,
      {
        next: { revalidate: 300 },
      }
    ),

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/worker/public/${id}`,
      {
        next: { revalidate: 300 },
      }
    ),
  ]);

  if (!workerRes.ok) {
    return null;
  }

  const worker = await workerRes.json();

  const reviews = reviewRes.ok
    ? await reviewRes.json()
    : { reviews: [], stats: null };

  const jobs = jobsRes.ok
    ? await jobsRes.json()
    : { data: { jobs: [] } };

  return {
    worker:
      worker.data ||
      worker.user ||
      worker,

    reviews:
      reviews.reviews || [],

    ratingStats:
      reviews.stats || null,

    jobs:
      jobs.data?.jobs || [],
  };
}

export default async function Page({ params }) {
  const { id } = await params;

  const data = await getWorker(id);

  console.log(data)

  if (!data) {
    return <div>Worker not found</div>;
  }

  return (
    <Workerprofile
      worker={data.worker}
      reviews={data.reviews}
      ratingStats={data.ratingStats}
      jobs={data.jobs}
      id={id}
    />
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    return {
      title: "Worker | FindArtisans",
    };
  }

  const result = await res.json();

  const worker =
    result.data ||
    result.user ||
    result;

  return {
    title: `${worker.user.fullName} | ${worker.user.skill} | FindArtisans`,

    description:
      worker.about ||
      `Hire ${worker.user.fullName}, a verified ${worker.user.skill} in ${worker.user.location?.city}, ${worker.user.location?.state}.`,

    alternates: {
      canonical: `https://find-artisans.com/workers/${id}`,
    },

    openGraph: {
      title: `${worker.user.fullName} | FindArtisans`,
      description:
        worker.about ||
        `Verified ${worker.user.skill} in ${worker.user.location?.state}.`,
      url: `https://find-artisans.com/workers/${id}`,
      images: [
        {
          url:
            worker.user.profilePhoto ||
            "/images/default-worker.jpg",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: worker.fullName,
      description:
        worker.about ||
        `${worker.skill} on FindArtisans`,
      images: [
        worker.profilePhoto ||
          "/images/default-worker.jpg",
      ],
    },
  };
}
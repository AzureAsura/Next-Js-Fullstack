import { auth } from "@/auth";
import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/lib/queris";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import Image from "next/image";


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null }
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params })

  const session = await auth()

  return (
    <>
      <section className="relative w-full min-h-[530px] flex flex-col justify-center items-center py-10 px-6 overflow-hidden">
        <Image
          src="/container.avif"
          alt="Background image"
          fill
          priority
          className="object-cover object-center -z-10"
        />

        <div className="absolute inset-0 bg-black/50 -z-10" />

        <div className="relative z-10 text-center">
          <h1 className="heading text-white">
            Pitch your startup, <br /> Connect with entrepreneur
          </h1>

        </div>
        
          <p className="sub-heading text-white/90 !max-w-3xl">
            Submit ideas, vote on pitches, and get noticed in virtual competitions
          </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search result form "${query}"` : `All startups`}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>

      </section>

      <SanityLive />

    </>
  );
}

import Link from "next/link";
import { ArrowRight, HeartHandshake, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-2xl bg-kida-purple p-8 text-white">
            <div>
              <Users className="size-8 text-kida-gold" />
              <h3 className="mt-4 font-heading text-2xl font-semibold">Join the KIDA Network</h3>
              <p className="mt-2 text-white/75 text-pretty">
                Verify your admission number, build your professional profile, and reconnect with classmates across
                the world.
              </p>
            </div>
            <Button
              size="lg"
              className="mt-6 w-fit bg-kida-gold text-kida-charcoal hover:bg-kida-gold-light"
              nativeButton={false}
              render={<Link href="/membership/become-member" />}
            >
              Become a Member <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between rounded-2xl bg-kida-maroon p-8 text-white">
            <div>
              <HeartHandshake className="size-8 text-kida-gold" />
              <h3 className="mt-4 font-heading text-2xl font-semibold">Give Back to Kibabii</h3>
              <p className="mt-2 text-white/75 text-pretty">
                Fund scholarships, support the Emergency Fund, or contribute to a community project shaping the next
                generation of Kibabiians.
              </p>
            </div>
            <Button
              size="lg"
              variant="outline"
              className="mt-6 w-fit border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              nativeButton={false}
              render={<Link href="/give" />}
            >
              Donate Now <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

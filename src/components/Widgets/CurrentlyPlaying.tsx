import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MdMusicNote, MdMusicOff } from "react-icons/md";

import { CurrentlyPlayingData } from "../../services/spotify";
import { transitions } from "../../styles/motion-definitions";
import LinkIconButton from "../Inputs/LinkIconButton";

interface Props {
  className?: string;
}

export default function CurrentlyPlaying({ className = "" }: Props) {
  //#region Hooks

  const { data } = useQuery({
    queryKey: ["currently-playing"],
    queryFn: () =>
      fetch("/api/currently-playing").then((res) =>
        res.json()
      ) as Promise<CurrentlyPlayingData>,
    refetchInterval: 1000 * 20,
  });

  //#endregion

  //#region Derived Data

  const item =
    data?.is_playing && data?.currently_playing_type === "track"
      ? data.item
      : null;

  //#endregion

  return (
    <div className={"flex items-center " + className}>
      <AnimatePresence mode={"popLayout"} initial={false}>
        {item ? (
          <motion.div
            key={item.name}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={transitions.springStiff}
          >
            <LinkIconButton
              href={item.external_urls.spotify}
              className={"flex items-center"}
            >
              <motion.div
                animate={{
                  rotate: [10, 0, -10],
                  y: [-5, 0, -5],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 0.1,
                  duration: 0.4,
                }}
              >
                <MdMusicNote className={"text-2xl"} />
              </motion.div>
              <span className="ml-1 max-w-[14rem] overflow-hidden text-ellipsis whitespace-nowrap sm:max-w-xs xl:max-w-sm">
                {item.artists?.[0]?.name} — {item.name}
              </span>
            </LinkIconButton>
          </motion.div>
        ) : (
          <motion.div
            key={"not-playing"}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={transitions.springStiff}
          >
            <MdMusicOff className={"inline-block text-2xl"} />
            <span className="ml-1">Not playing — Spotify</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

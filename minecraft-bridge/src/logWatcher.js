import pkg from "tail";

const { Tail } = pkg;

export function watchLogFile(filePath, onLine) {
  const tail = new Tail(filePath, {
    follow: true,
    useWatchFile: true,
    fsWatchOptions: { interval: 500 },
    fromBeginning: false,
  });

  tail.on("line", onLine);
  tail.on("error", (error) => {
    console.error("Error watching log file:", error);
  });
  return tail;
}

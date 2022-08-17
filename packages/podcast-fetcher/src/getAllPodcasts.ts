import getPodcasts from "./getPodcasts";

const getAllPodcasts = async (processWeights = false) => {
  const { podcasts } = await getPodcasts();

  return podcasts;
};

export default getAllPodcasts;

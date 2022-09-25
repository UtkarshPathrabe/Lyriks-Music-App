import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetSongsByCountryQuery } from '../redux/services/shazamCore';

const AroundYou = () => {
  const [country, setCountry] = useState(localStorage.getItem('country_code'));
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsByCountryQuery(country);

  useEffect(() => {
    if (!country) {
      axios.get('https://ipapi.co/json')
        .then((response) => {
          const countryCode = response?.data?.country_code;
          setCountry(countryCode);
          localStorage.setItem('country_code', countryCode);
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [country]);

  if (isFetching && loading) {
    return <Loader title="Loading songs around you" />;
  }

  if (error && country) {
    return <Error />;
  }

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Around You <span className="font-black">{country}</span></h2>
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        { data?.map((song, i) => (<SongCard key={song?.key} i={i} song={song} isPlaying={isPlaying} activeSong={activeSong} data={data} />)) }
      </div>
    </div>
  );
};

export default AroundYou;

import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { NASA_WEBSITE_URL } from '../constants/nasa';
import type { ApodData } from '../types/nasa';
import { getApodWatchUrl, isApodVideo } from './nasa';

export const openApodLink = async (apod: ApodData): Promise<void> => {
  if (isApodVideo(apod)) {
    await Linking.openURL(getApodWatchUrl(apod));
    return;
  }

  await WebBrowser.openBrowserAsync(NASA_WEBSITE_URL);
};

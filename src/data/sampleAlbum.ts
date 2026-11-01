/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlbumMetadata, AlbumPhoto, AlbumPage } from '../types/album';

export const INITIAL_ALBUM_META: AlbumMetadata = {
  id: 'album-cornwall-1998',
  title: 'Summer by the Atlantic Coast',
  subtitle: 'A fortnight of salt spray, hidden coves & quiet afternoon tea',
  description: 'A nostalgic collection of moments gathered along the rugged coastal footpaths of Cornwall. From the morning tide rolling across the sand at St Ives to the stone cottages of Port Isaac, these photographs document two weeks of slow living, family walks, and coastal sunsets.',
  curator: 'The Harrison Family Archive',
  dateRange: 'Late Summer, August 1998',
  coverMaterial: 'burgundy-leather',
  foilStyle: 'gold',
  cornerStyle: 'black-classic',
  scriptStyle: 'serif-editorial',
  embellishment: 'wax-seal',
  paperTone: 'warm-cream',
  createdAt: '1998-08-28',
};

export const INITIAL_PHOTOS: AlbumPhoto[] = [
  {
    id: 'photo-1',
    name: 'st_ives_harbor.jpg',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
    caption: 'Low tide at the old fishing harbor. The salt air was sharp and fresh before breakfast.',
    date: 'August 14, 1998',
    location: 'St Ives Harbor, Cornwall',
    aspectRatio: 'landscape',
    rotation: 0.5,
  },
  {
    id: 'photo-2',
    name: 'clifftop_path.jpg',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Looking down towards the cove along the coastal path. Heather blooming along the granite ledges.',
    date: 'August 15, 1998',
    location: 'Zennor Headland',
    aspectRatio: 'landscape',
    rotation: -0.7,
  },
  {
    id: 'photo-3',
    name: 'eleanor_stone_wall.jpg',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    caption: 'Eleanor resting on the dry-stone wall after the steep climb from the cove.',
    date: 'August 16, 1998',
    location: 'Penwith Moors',
    aspectRatio: 'portrait',
    rotation: 1.1,
  },
  {
    id: 'photo-4',
    name: 'grandfather_reading.jpg',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    caption: 'Grandfather engrossed in his maritime paperback on the veranda.',
    date: 'August 17, 1998',
    location: 'Cottage Veranda, St Just',
    aspectRatio: 'portrait',
    rotation: -0.9,
  },
  {
    id: 'photo-5',
    name: 'cottage_tea.jpg',
    url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80',
    caption: 'Afternoon cream tea: fresh scones, clotted cream, and strawberry preserve.',
    date: 'August 18, 1998',
    location: 'The Old Post Office Tearoom',
    aspectRatio: 'square',
    rotation: 0.4,
  },
  {
    id: 'photo-6',
    name: 'rockpool_explorers.jpg',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
    caption: 'Searching for hermit crabs in the tidal pools before the tide turned.',
    date: 'August 19, 1998',
    location: 'Porthmeor Beach',
    aspectRatio: 'landscape',
    rotation: -0.6,
  },
  {
    id: 'photo-7',
    name: 'lighthouse_twilight.jpg',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Godrevy lighthouse beacon flashing across the bay at dusk.',
    date: 'August 21, 1998',
    location: 'St Ives Bay',
    aspectRatio: 'landscape',
    rotation: 0.8,
  },
  {
    id: 'photo-8',
    name: 'wooden_dory.jpg',
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
    caption: 'Weathered blue dory tied to the iron ring on the slipway.',
    date: 'August 22, 1998',
    location: 'Mousehole Quay',
    aspectRatio: 'square',
    rotation: -1.0,
  },
];

export const INITIAL_PAGES: AlbumPage[] = [
  {
    pageNumber: 1,
    templateId: 'frontispiece',
    photoIds: ['photo-1'],
    customTitle: 'Introduction & Frontispiece',
  },
  {
    pageNumber: 2,
    templateId: 'twin-portrait',
    photoIds: ['photo-3', 'photo-4'],
    customTitle: 'The Travellers',
  },
  {
    pageNumber: 3,
    templateId: 'story-trio',
    photoIds: ['photo-2', 'photo-5', 'photo-6'],
    customTitle: 'Along the Coast Path',
  },
  {
    pageNumber: 4,
    templateId: 'duo-landscape',
    photoIds: ['photo-7', 'photo-8'],
    customTitle: 'Evening at the Harbor',
  },
];

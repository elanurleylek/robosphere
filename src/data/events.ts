
import { EventProps } from '@/components/events/EventCard';

export const eventsList: EventProps[] = [
  {
    title: "Uluslararası Robotik Konferansı 2023",
    date: "15-17 Temmuz 2023",
    location: "İstanbul",
    type: "Konferans",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    attendees: 1200,
    featured: true
  },
  {
    title: "MEB Robot Yarışması",
    date: "24-26 Ağustos 2023",
    location: "Ankara",
    type: "Yarışma",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    attendees: 500
  },
  {
    title: "Arduino ile Robotik Workshop",
    date: "5 Temmuz 2023",
    location: "İzmir",
    type: "Workshop",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    attendees: 50
  },
  {
    title: "Otonom Robotlar Hackathon",
    date: "12-13 Temmuz 2023",
    location: "Online",
    type: "Yarışma",
    attendees: 300
  }
];

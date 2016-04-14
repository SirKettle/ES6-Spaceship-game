// Deep Space FM
require('file?!../assets/audio/space_oddity.mp3');

// SFX Text FM
require('file?!../assets/audio/booo_daddy.wav');
require('file?!../assets/audio/booo_high.wav');
require('file?!../assets/audio/booo_standard.wav');
require('file?!../assets/audio/booo_long.wav');

export default [
  {
    station: 'Deep Space FM',
    tracks: [
      {
        title: 'Space oddity',
        artist: 'David Bowie',
        src: '/assets/audio/space_oddity.mp3'
      }
    ]
  },
  {
    station: 'SFX Text FM',
    tracks: [
      {
        title: 'Booo Daddy',
        artist: 'Will Thirkettle',
        src: '/assets/audio/booo_daddy.wav'
      },
      {
        title: 'Booo High',
        artist: 'Harrison Thirkettle',
        src: '/assets/audio/booo_high.wav'
      },
      {
        title: 'Booo Standard',
        artist: 'Harrison Thirkettle',
        src: '/assets/audio/booo_standard.wav'
      },
      {
        title: 'Booo Long',
        artist: 'Harrison Thirkettle',
        src: '/assets/audio/booo_long.wav'
      }
    ]
  }
];
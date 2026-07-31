module.exports = [
  {
    id: 'agnes',
    enabled: true,
    priority: 100,
    capabilities: [
      'text-to-image',
      'image-to-image',
      'text-to-video',
      'image-to-video',
      'keyframes-to-video'
    ],
    provider: require('./agnes.cjs')
  }
];

# Project gallery images

Drop four screenshots per project into its folder, named `1.webp` … `4.webp`:

```
gallery/
├── go/            GO Delivery Platform
├── careerly/      Careerly
├── bin-saedan/    Bin Saedan Smart ERP
├── streamore/     Streamore
└── power-zone/    Power Zone Dashboard
```

- Missing slots fall back to the project's cover image, so nothing breaks while folders are empty.
- Tiles render at about 16:9 on desktop and 16:10 on phones (cropped with `object-fit: cover`) — export around 1280×720.
- Convert with `npm run img:webp -- src/assets/img/projects/gallery --width=1280`.
- To add a project, add its entry (with a `slug`) in `src/constants/projects.ts` and create `gallery/<slug>/`.

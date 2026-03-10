# 3D model assets (.glb / .gltf)

Place your character model files here, then wire them in `types/achievements.ts`.

## Steps

1. Add your `.glb` or `.gltf` file (e.g. `hulk.glb`, `naruto.glb`, `captain.glb`).

2. In `types/achievements.ts`, add `modelSource` and optional `modelScale` to the character:

```ts
{
  id: 'titan',
  name: 'Hulk',
  // ... other fields ...
  modelSource: require('@/assets/models/hulk.glb'),
  modelScale: 1.2,  // optional: adjust if model is too big or small
}
```

3. Restart the dev server after adding new assets (`npx expo start`).

The app will load and display your model instead of the built-in primitive character for that slot.

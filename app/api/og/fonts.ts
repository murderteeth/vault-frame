type FontStyle = 'normal' | 'italic' | undefined
type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | undefined

export async function fetchFonts() {
  const fontDataMonoRegular = await fetch(
    new URL('../../fonts/AeonikMono-Regular.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  return [
    {
      name: 'aeonik',
      data: fontDataMonoRegular,
      style: 'normal' as FontStyle,
      weight: 400 as Weight,
    }
  ]
}

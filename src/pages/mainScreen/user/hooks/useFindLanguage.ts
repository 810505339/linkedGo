import { useEffect } from "react"
import { loadLanguageStorage } from "@storage/language/action";
import { useImmer } from "use-immer"

export default () => {
  const [data, setData] = useImmer<{ language: any }>({
    language: `{ "type": "en", "title": "English", key: 'en' }`
  })
  async function findlanguage() {
    const { language } = await loadLanguageStorage();
    /* en,zh */

    const list = [
      { "type": "zh-cn", "title": "中文", key: 'zh' },
      { "type": "en", "title": "English", key: 'en' }
    ]

    setData((draft) => {
      draft.language = JSON.stringify((list.find(l => l.key === language) ?? { "type": "en", "title": "English", key: 'en' }))
    })
  }

  useEffect(() => {
    (async () => {
      await findlanguage()

    })()
  }, [])

  return {
    data,
    findlanguage
  }
}

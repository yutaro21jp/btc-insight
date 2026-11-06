'use client'

import { useState } from 'react'

type TimelineEvent = {
  title: string
  description: string
  dateLabel?: string
}

const timelineData: { year: string; events: TimelineEvent[] }[] = [
  {
    year: '2008',
    events: [
      {
        title: 'Satoshi Nakamotoが論文を発表',
        description:
          'ビットコインの基本的な仕組みを記述した論文「Bitcoin: A Peer-to-Peer Electronic Cash System」（通称、ビットコインホワイトペーパー）が公開される。',
      },
    ],
  },
  {
    year: '2009',
    events: [
      {
        title: 'ジェネシスブロックが生成される',
        description:
          'ビットコインの最初のブロック（ジェネシスブロック）が生成され、ネットワークが稼働を開始する。',
      },
    ],
  },
  {
    year: '2010',
    events: [
      {
        title: '初のビットコイン取引',
        description:
          'プログラマーのラズロ・ハニエツが、1万BTCで2枚のピザを購入。これが記録上初のビットコインによる商取引とされる。',
      },
    ],
  },
  {
    year: '2011',
    events: [
      {
        title: '1ドル到達',
        description:
          'ビットコイン価格が初めて1BTC＝1USDに到達。国際的に取引所が増加し、知名度が高まった年。',
      },
      {
        title: 'シルクロードがサービスを開始',
        description:
          'オンライン闇市場シルクロードが立ち上がり、2年間の運営を開始。2013年に連邦当局によって閉鎖されるまで、ビットコインを交換媒体として実世界で応用した最初の事例の1つとして、ビットコインコミュニティにとって重要な存在となる。',
      },
      {
        title: 'WikiLeaksがビットコインでの寄付受付を開始',
        description:
          '内部告発サイトWikiLeaksが、ビットコインでの寄付受け入れを開始し、注目を集める。',
      },
    ],
  },
  {
    year: '2012',
    events: [
      {
        title: '初の半減期',
        description:
          '11月28日、ブロック報酬が50BTCから25BTCに減少。供給量の制御機能が実際に稼働した初の事例。',
      },
    ],
  },
  {
    year: '2013',
    events: [
      {
        title: '価格が1,000ドルを突破',
        description:
          'キプロス危機などを背景にビットコインへの注目が高まり、価格が初めて1,000ドルを突破する。',
      },
      {
        title: '世界初のビットコインATM',
        description:
          'カナダのバンクーバーに世界初のビットコインATMが設置される。2013年10月のこの出来事以来、ビットコインATMはより一般的になり、世界中に何千もの機械が設置されている。',
      },
    ],
  },
  {
    year: '2014',
    events: [
      {
        title: 'マウントゴックス社の破綻',
        description:
          '当時世界最大級の取引所であったマウントゴックス社が、ハッキングにより大量のビットコインを失い破綻。市場に大きな打撃を与える。',
      },
    ],
  },
  {
    year: '2015',
    events: [
      {
        title: 'ライトニングネットワーク論文が発表される',
        description:
          'Joseph PoonとThaddeus Dryjaがライトニングネットワークの仕組みを記述した論文を発表し、ビットコインブロックチェーン上でオフチェーントランザクションを高速かつスケーラブルに実行するためのプロトコルを提示しました。',
      },
    ],
  },
  {
    year: '2016',
    events: [
      {
        title: '2度目の半減期',
        description:
          '7月9日、ブロック報酬が25BTCから12.5BTCに減少。価格と採掘経済に大きな影響を与えた。',
      },
    ],
  },
  {
    year: '2017',
    events: [
      {
        title: 'ビットコイン独立記念日',
        description:
          '2017年8月1日、ブロックサイズ戦争の末にSegWitが有効化され、ビットコインの分散性と独立性が守られた日。多くのビットコイナーがこの日を「ビットコイン独立記念日」と呼ぶ。',
      },
      {
        title: '価格が2万ドルに迫る',
        description:
          '暗号資産市場全体が盛り上がりを見せ、ビットコイン価格は年末に2万ドルに迫る勢いで高騰する。',
      },
    ],
  },
  {
    year: '2018',
    events: [
      {
        title: 'Liquid Network始動',
        description:
          'Blockstream社が23の大手仮想通貨取引所と参画して、ビットコインでは初となるサイドチェーンプロジェクトLiquid Networkの実運用を開始した。',
      },
      {
        title: 'ライトニングネットワーク始動',
        description:
          'ビットコインの高速・低コスト送金を可能にするライトニングネットワークの実運用が始まり、エコシステムの発展が加速。',
      },
    ],
  },
  {
    year: '2019',
    events: [
      {
        title: 'ビットコイン先物市場拡大',
        description: 'Bakktがビットコイン先物取引を開始し、機関投資家の参入が進む。',
      },
    ],
  },
  {
    year: '2020',
    events: [
      {
        title: '3度目の半減期',
        description:
          '5月11日、ブロック報酬が12.5BTCから6.25BTCに減少。供給スケジュール通りの進行が注目を集めた。',
      },
      {
        title: 'コロナショックと金融緩和',
        description:
          '新型コロナウイルスのパンデミックによる経済の不確実性と、各国の中央銀行による大規模な金融緩和を背景に、価値の保存手段としてビットコインが注目される。',
      },
    ],
  },
  {
    year: '2021',
    events: [
      {
        title: 'エルサルバドルが法定通貨に採用',
        description: 'エルサルバドルが、世界で初めてビットコインを法定通貨として採用する。',
      },
      {
        title: '価格が史上最高値を更新',
        description:
          '機関投資家の参入などが進み、4月には価格が64,000ドルを超え、史上最高値を更新する。',
      },
    ],
  },
  {
    year: '2022',
    events: [
      {
        title: 'Taroプロトコル発表',
        description:
          'ライトニングネットワーク上でトークンや資産を発行・送受信できるTaroプロトコルが発表され、ビットコインのインフラ拡張の可能性が広がった。',
      },
    ],
  },
  {
    year: '2023',
    events: [
      {
        title: 'ライトニングネットワーク容量過去最高更新',
        description:
          'ライトニングネットワークのグローバルチャネル容量が5,000BTCを突破し、ビットコインの高速送金インフラが過去最大規模に拡大。',
      },
      {
        title: 'エルサルバドル、ビットコイン債券法案可決',
        description:
          'エルサルバドル議会が、ビットコインを裏付けとした「ボルケーノ債券」発行法案を可決。国家としてのビットコイン戦略が一歩前進。',
      },
    ],
  },
  {
    year: '2024',
    events: [
      {
        title: '米国でビットコイン現物ETFが承認される',
        description:
          '米国証券取引委員会（SEC）が、ビットコインの現物ETFを初めて承認。これにより、より多くの投資家がビットコインにアクセスしやすくなる。',
      },
      {
        title: '4度目の半減期',
        description: '4月20日、ブロック報酬が6.25BTCから3.125BTCに減少。',
      },
      {
        title: '価格が73,000ドルを突破',
        description:
          '現物ETFへの資金流入などを背景に、3月には価格が73,000ドルを超え、史上最高値を更新する。',
      },
      {
        // 出典: https://www.coinbase.com/en-gb/institutional/research-insights/research/weekly-market-commentary/weekly-2024-12-06
        dateLabel: '12月',
        title: 'ビットコイン、史上初の10万ドル突破',
        description:
          'ビットコイン価格が初めて1BTC＝10万米ドルを突破。米国時間12月4日夜、日本時間では12月5日に、初めて6桁のドル価格に到達した。',
      },
    ],
  },
  {
    year: '2025',
    events: [
      {
        // 出典: https://www.whitehouse.gov/presidential-actions/2025/03/establishment-of-the-strategic-bitcoin-reserve-and-united-states-digital-asset-stockpile/
        dateLabel: '3月6日',
        title: '米国が戦略的ビットコイン準備金の設立を指示',
        description:
          '大統領令が、政府が没収などで保有するビットコインを原資とした準備金の設立を指示。組み入れたBTCは原則として売却せず、準備資産として保有する方針を示した。',
      },
      {
        // 出典: https://gc.nh.gov/bill_status/billinfo.aspx?id=707
        // 出典: https://gc.nh.gov/bill_status/legacy/bs2016/billText.aspx?id=707&sy=2025&v=SP
        dateLabel: '5月6日',
        title: 'ニューハンプシャー州、州資金のビットコイン投資を可能に',
        description:
          '州資金の投資対象にビットコインを含められるHB302が、知事の署名で成立。投資額の上限や保管方法を定め、州によるビットコイン保有の法的な枠組みを設けた。',
      },
      {
        // 出典: https://comptroller.texas.gov/transparency/reports/comprehensive-annual-financial/2025/intro.pdf
        dateLabel: '2025年後半',
        title: 'テキサス州がビットコイン準備金に資金を投入',
        description:
          '州議会が準備金に1,000万ドルを配分。州会計監査官の年次報告によると、2025年後半に500万ドル規模のビットコイン投資を実施し、州予算を使った運用へ進んだ。',
      },
    ],
  },
  {
    year: '2026',
    events: [
      {
        // 出典: https://mempool.space/block/000000000000000000002afe1e2f7e176047529419532b2a6773c45623a02c12
        dateLabel: '3月9日',
        title: 'ビットコインの発行枚数が約2,000万BTCに到達',
        description:
          'ブロック高940,000に到達し、発行スケジュール上の累計が約2,000万BTCに。上限2,100万BTCまで残る約100万BTCは、今後の半減期を経ながら発行される。',
      },
    ],
  },
]

export default function Timeline() {
  const [openYears, setOpenYears] = useState<string[]>(timelineData.map((item) => item.year))

  const toggleYear = (year: string) => {
    setOpenYears((prevOpenYears) =>
      prevOpenYears.includes(year)
        ? prevOpenYears.filter((y) => y !== year)
        : [...prevOpenYears, year]
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 pb-12 bg-gray-50 rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-12 text-orange-500">ビットコイン歴史年表</h2>
      <div className="border-l-2 border-gray-200">
        {timelineData.map((item) => (
          <div key={item.year} id={`timeline-${item.year}`} className="relative scroll-mt-8">
            <div
              onClick={() => toggleYear(item.year)}
              className="absolute -left-[11px] top-0 h-full cursor-pointer"
            >
              <div className="w-5 h-5 bg-white border-2 border-orange-300 rounded-full"></div>
            </div>
            <div className="ml-8">
              <div
                onClick={() => toggleYear(item.year)}
                className="text-xl font-bold w-full text-left focus:outline-none text-orange-500 cursor-pointer"
              >
                {item.year}
              </div>
              {openYears.includes(item.year) && (
                <div className="mt-4 mb-8">
                  {item.events.map((event, index) => (
                    <div key={index} className="p-4 border rounded-lg shadow-sm">
                      {event.dateLabel && (
                        <p className="text-sm text-gray-500 mb-1">{event.dateLabel}</p>
                      )}
                      <h3 className="font-bold">{event.title}</h3>
                      <p className="mt-2 text-gray-600">{event.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8 text-gray-600">
        <p>
          ビットコイン歴史年表は進化中です。新しい情報や改善案があれば、ぜひ
          <a
            href="https://github.com/yutaro21jp/btc-insight"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            GitHub
          </a>
          でご提案ください。
        </p>
      </div>
    </div>
  )
}

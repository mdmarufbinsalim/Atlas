import { Descendant } from "slate"

const b = (text: string) => ({ text, mode: 'text' as const, bold: true })
const u = (text: string) => ({ text, mode: 'text' as const, underlined: true })
const s = (text: string) => ({ text, mode: 'text' as const, striked: true })
const t = (text: string) => ({ text, mode: 'text' as const })
const h = (text: string, level: 1 | 2 | 3 | 4) => ({ text, mode: `header_${level}` as const })

const block = (...children: ReturnType<typeof t | typeof b | typeof u | typeof s | typeof h>[]) =>
    ({ type: 'block' as const, children })

export const initialValue: Descendant[] = [
    block(h('World War II', 1)),
    block(t('The deadliest conflict in human history — six years of war that reshaped every corner of the globe.')),

    block(h('Origins', 2)),
    block(
        t('The war grew from the unresolved tensions of '),
        u('World War I'),
        t('. The '),
        b('Treaty of Versailles (1919)'),
        t(' left Germany economically crippled and politically humiliated, creating fertile ground for extremism. Adolf Hitler rose to power in '),
        b('1933'),
        t(', promising restoration of German greatness through territorial expansion and racial ideology.'),
    ),
    block(
        t('In Asia, '),
        b('Imperial Japan'),
        t(' pursued its own empire, invading China in '),
        b('1937'),
        t(' and clashing with Western colonial interests across the Pacific.'),
    ),

    block(h('The War Begins — 1939', 3)),
    block(
        t('On '),
        u('1 September 1939'),
        t(', Germany invaded Poland. Britain and France declared war two days later. Within weeks, Poland was divided between Germany and the Soviet Union under the '),
        b('Molotov–Ribbentrop Pact'),
        t('. By mid-1940, France had fallen and Britain stood alone, enduring the '),
        b('Blitz'),
        t(' — a relentless German bombing campaign.'),
    ),

    block(h('A Global Conflict — 1941', 3)),
    block(
        t('The war transformed on two fronts in 1941. Hitler broke his pact with Stalin and launched '),
        b('Operation Barbarossa'),
        t(' — the largest land invasion in history — driving deep into Soviet territory. Then, on '),
        u('7 December 1941'),
        t(', Japan attacked the US naval base at '),
        b('Pearl Harbor'),
        t(', drawing America into the conflict. The war was now truly global.'),
    ),

    block(h('Turning Point — 1942–43', 3)),
    block(
        t('Three battles shifted the momentum decisively against the Axis. At '),
        b('Stalingrad'),
        t(', the Soviet Red Army encircled and destroyed an entire German army. At '),
        b('El Alamein'),
        t(', the British halted Germany\'s advance into North Africa. In the Pacific, the '),
        b('Battle of Midway'),
        t(' crippled the Japanese naval fleet. From this point, the Allies '),
        s('struggled to'),
        t(' advanced on every front.'),
    ),

    block(h('Allied Victory — 1944–45', 3)),
    block(
        t('On '),
        u('6 June 1944'),
        t(' — '),
        b('D-Day'),
        t(' — Allied forces landed on the beaches of Normandy in the largest seaborne invasion ever mounted. Paris was liberated by August. In the Pacific, island-hopping campaigns brought American forces within striking distance of Japan. Germany surrendered on '),
        u('8 May 1945'),
        t('. After atomic bombs destroyed '),
        b('Hiroshima'),
        t(' and '),
        b('Nagasaki'),
        t(', Japan followed on '),
        u('2 September 1945'),
        t('.'),
    ),

    block(h('Legacy', 2)),
    block(
        b('70–85 million people'),
        t(' perished — roughly '),
        s('2%'),
        t(' 3% of the world\'s population. The war ended European colonial dominance, established the '),
        b('United Nations'),
        t(', and split the world into two Cold War blocs. The '),
        b('Nuremberg Trials'),
        t(' established that individuals could be held accountable for crimes against humanity. Its shadow still shapes international law, borders, and memory today.'),
    ),
]

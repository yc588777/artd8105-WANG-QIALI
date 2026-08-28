# Parameters

*One row per decision your instruction leaves open. Filled in during session 2, with the agent.*

页面比例是展览条件，不是参数：ISO 竖版，A2 = 420 × 594 mm（与 A4 同比例）。
Page proportion is a condition of the show, not a parameter: ISO portrait, A2 = 420 × 594 mm (same proportion as A4).

## Version 2 — 波浪线 / 三形 / 扇形

| Parameter | From which phrase | Range | Default | Why this range |
|---|---|---|---|---|
| 波浪数量 / Wave count | "parallel wavy lines" | 3–12 | 7 | 少于 3 条形不成明确的色带；多于 12 条上半页过密。<br>Fewer than 3 lines would not create a clear visual band, while more than 12 would make the upper part of the page too dense. |
| 波浪振幅 / Wave amplitude | "wavy" | 页高的 0.5%–4% | 2% | 允许浅波纹和更深的波浪，又不至于让线条无法辨认。<br>This range permits both shallow ripples and deeper waves without making the lines illegible. |
| 波浪周期 / Wave cycles | "wavy" | 2–8 个周期 | 4 | 同上：浅波纹到更深的波浪。<br>Same reason: shallow ripples through to deeper waves. |
| 波浪带下沿 / Wave-band lower boundary | "located at the top part of the page" | 距顶边 5%–25% 页高 | 15% | 带子始终在顶部，但深度可以变。<br>This keeps the band clearly at the top while allowing its depth to vary. |
| 波浪跨度 / Wave span | "going from left to right" | 固定为通栏 | 通栏 / full width | 波浪始终跑满页宽。<br>The waves should always run across the full page width. |
| 三形组水平位置 / Group horizontal centre | "slightly above the center of the page" | 页宽 40%–60% | 50% | 组保持在中心附近，但允许有限偏左偏右。<br>This keeps the group slightly above the page centre while allowing limited off-centre variation. |
| 三形组垂直位置 / Group vertical centre | "slightly above the center of the page" | 页高 35%–48% | 42% | 保持略高于页面中心。<br>This keeps the group slightly above the page centre. |
| 三角形旋转 / Triangle rotation | "a triangle" | −45°–+45° | 0°（尖朝上 / pointing up） | 保持可辨认，同时允许变化。<br>This maintains recognition while allowing variation. |
| 矩形长宽比 / Rectangle aspect ratio | "a rectangle" | 1:1–2:1 | 1.5:1 | 保持可辨认，同时允许变化。<br>This maintains recognition while allowing variation. |
| 主形尺寸（圆） / Main shape size (circle) | "a triangle, a rectangle and a circle" | 页宽 14%–26% | 20% | 保持可辨认，同时允许变化。<br>This maintains recognition while allowing variation. |
| 矩形相对大小 / Rectangle size vs circle | "the rectangle is medium-sized" | 圆直径的 72%–95% | 84% | **推断的范围 / range inferred：** 你规定了默认大小顺序（圆 > 矩形 > 三角形），但没有给出两个较小形的数字。若不对，改这一行。<br>You specified the default order (circle largest, rectangle medium, triangle smallest) but not the two smaller sizes. Change this row if it is wrong. |
| 三角形相对大小 / Triangle size vs circle | "the triangle is the smallest" | 圆直径的 55%–82% | 66% | **推断的范围 / range inferred：** 同上。<br>Same as above. |
| 重叠量 / Overlap | "All shapes are overlapping." | 较小形的 15%–45% | 30% | 形成统一的一组，而不是三个互不相关的形。<br>This produces a unified group rather than three unrelated shapes. |
| 重叠方式 / Overlap mode | "All shapes are overlapping." | 固定：三形必须有共同重叠区 | 共同重叠 / triple overlap | 三形必须共享至少一块共同重叠区域。<br>All three shapes must share at least one common overlapping area. |
| 叠放顺序 / Stacking order | "All shapes are overlapping." | 固定 | 三角形在后，矩形在中，圆在上 / triangle back, rectangle middle, circle on top | 固定叠放顺序。<br>The fixed stacking order is triangle at the back, rectangle in the middle, and circle on top. |
| 放射线数量 / Fan line count | "an array of multiple lines" | 5–13 | 9 | 形成可辨认的扇形，同时保留线间空隙。<br>This creates a recognisable fan while preserving visible gaps between the lines. |
| 放射线起点 / Fan origin | "extending from the lowest point of the circle" | 固定 | 大圆最低点 / lowest point of the large circle | 所有线从同一点出发。<br>All lines begin from one shared point at the lowest point of the large circle. |
| 放射线间距 / Fan spacing | "evenly spaced" | `bottom`（底边等距）或 `angle`（等角） | `bottom` | **冲突 / conflict：** 你在第 7 条写了「按角均分」，在第 8 条（标为固定）写了「内线落在底边等分点」。两者只有在原点正好居中时才大致接近，不能同时精确成立。工具里做成切换。默认跟第 8 条与原文「第一根到左下角、最后一根到右下角」一致：沿底边等距。若你要等角，把开关拨过去。<br>You wrote two different rules. The tool has a switch. Default follows the block you marked fixed: even spacing along the bottom edge. |
| 扇形两端 / Fan endpoints | "The first line touches the bottom left corner… the last line touches the bottom right corner" | 固定 | 左下角与右下角 / bottom-left and bottom-right corners | 此规则保持固定。<br>This rule should remain fixed. |
| 扇形是否穿过三形 / Fan vs other shapes | (never mentioned; then decided) | 固定 | 留在大圆下方；不穿过三角形或矩形 | 保持下部结构清楚。<br>This keeps the lower structure clear. |
| 底列圆数量 / Bottom-row circle count | "each circle is between two lines" | 固定为 N−1 | N−1 | 每条相邻线的空隙里一个圆。<br>If there are N radiating lines, there should be N−1 small circles, with one circle centred in each gap. |
| 底列圆高度 / Bottom-row height | "At the bottom of the page" | 页高 88%–96% | 92% | 单行圆在页面底部。<br>A single row of circles at the bottom of the page. |
| 底列圆直径 / Bottom-row circle diameter | "a single row of circles" | 页宽 3%–7% | 5% | 圆浮在空隙中，不贴线。<br>The circles should float in the gaps rather than touch the lines. |
| 底列圆与线的关系 / Bottom circles vs fan lines | "each circle is between two lines" | 固定：浮在空隙中，不贴线 | 不贴线 / do not touch | 圆浮在空隙中，而不是贴着线。<br>The circles should float in the gaps rather than touch the lines. |
| 主形填色 / Main-shape fill | (never mentioned) | 固定：填色 + 可见描边 | 填色 + 描边 / filled with outlines | 三个主形应填色，并有可见轮廓。<br>The three main shapes should be filled, with visible outlines. |
| 主形色相 / Shape hue | "of different colors" | 0–360° | 三角 8°（闷红）、矩形 46°（闷黄）、圆 214°（闷蓝） | 默认颜色：三角形闷红、矩形闷黄、圆形闷蓝。<br>The default colours are muted red for the triangle, muted yellow for the rectangle, and muted blue for the circle. |
| 主形饱和度 / Shape saturation | "of different colors" | 40%–80% | 58% | 这些范围允许视觉变化，同时保持清晰对比。<br>These ranges allow visual variation while maintaining clear contrast. |
| 主形明度 / Shape lightness | "of different colors" | 35%–75% | 50% | 同上。<br>Same. |
| 线宽 / Line weight | (never mentioned) | 预览 1–6 | 3 | 这些范围允许视觉变化，同时保持清晰对比。<br>These ranges allow visual variation while maintaining clear contrast. |
| 波浪色 / Wave colours | "Parallel wavy lines of different colors" | 各线不同色相；饱和度 40%–80%；明度 35%–75% | 饱和度 58%，明度 48%，色相由 seed 错开 | 指令要求波浪「不同颜色」。第 10 条曾写波浪默认炭黑，与指令冲突——波浪跟指令走（不同颜色）；扇形线跟第 10 条走（炭黑）。把波浪饱和度拉到 40% 以下会接近炭黑。<br>The instruction asks for different colours. Item 10’s charcoal default for waves would erase that. Waves follow the instruction; fan lines follow charcoal. |
| 扇形线颜色 / Fan line colour | (never mentioned) | 固定默认 | 深炭黑 / dark charcoal | 波浪和扇形线默认深炭黑——扇形线采用这一条。<br>The wavy lines and fan lines should default to dark charcoal. |
| 底列圆颜色 / Bottom-circle colour | (never mentioned) | 色相 0–360° | 与扇形线相同的炭黑填色 | **你未指定。** 没有另造一种颜色，只用已选定的炭黑。要改就拨色相。<br>**You did not specify this.** No new hue was invented; charcoal already chosen for the fan is the default. |
| 背景 / Background | (never mentioned) | 固定 | 米白 / off-white | 背景保持米白。<br>The background should remain off-white. |
| 种子 / Seed | （工具要求 / required by the tool） | 整数 | 1 | 同一 seed + 同一组滑杆，永远得到同一张图。它错开波浪的相位和色相起点。<br>The same seed plus the same sliders always gives the same drawing. It offsets wave phase and the starting hue of the wave set. |

**The last column is yours, in your own words.** Rows marked 推断 / inferred or 冲突 / conflict are the agent naming a gap — change those if they are not what you meant.

---

## Things the instruction never mentioned at all

*The interesting ones — decisions you did not notice you were making.*

- **填色还是只有轮廓 / Fill vs outline** — 指令只说“drawn”。你后来定为三个主形填色加描边。
- **叠放顺序 / Stacking order** — “overlapping” 没有说谁在上。你定为三角 → 矩形 → 圆。
- **线宽 / Line weight**
- **背景色 / Background colour** — 定为米白。
- **三个形的相对大小 / Relative sizes** — 指令没说谁大谁小。你定为圆最大、矩形中、三角最小；两个较小形的数字是推断的。
- **扇形线、底列圆的颜色 / Colour of fan lines and bottom circles**
- **“均匀”是等角还是底边等距 / What “evenly spaced” measures** — 见上表冲突行。
- **扇形线可否穿过三角和矩形 / Whether the fan may cross the other two shapes** — 你定为不可以。
- **页面比例 / Page proportion** — 不是你的决定：展览规定 ISO 竖版。

---

## The three regions

**Boring** — where changes to the parameters change nothing you care about.

**Surprising** — where it stopped resembling what you imagined but is still a legitimate execution.

**Breaking point** — where it stops being a valid execution of your instruction at all.

---

## What I rejected, and why

---

## Version 4 — 不规则相交圆 / irregular intersecting circles

学生决定：范围、默认值参考第一次生成的项目调整。
The student decided: set ranges and defaults by reference to the first generated project.

页面比例仍是展览条件，不是参数：ISO 竖版，A2 = 420 × 594 mm，10 mm 边距，裁切到页。
Page proportion remains a condition of the show, not a parameter.

圆与圆的关系是 **相交 / intersect**（Version 4 已去掉 “do not overlap”）。
The relation between circles is **intersect** (Version 4 dropped “do not overlap”).

标 **推断 / inferred** 的行，是从第一次项目类比过来的，不是你另写的数字。不对就改。
Rows marked **推断 / inferred** are analogues from the first project, not numbers you wrote yourself. Change them if they are wrong.

| Parameter | From which phrase | Range | Default | Why this range |
|---|---|---|---|---|
| 圆的个数 / Circle count | "The canvas is filled" / "medium to high density" | 20–80 | 47 | **推断 / inferred。** 第一次波浪 3–12 默认 7，带子约占页高 15%。铺满整页按同一疏密放大：7 ÷ 0.15 ≈ 47；范围 20–80（3÷0.15 到 12÷0.15）。第一次字面个数 5–13 铺不满 A2。你说参考第一次，所以用疏密类比，不是照抄 7。<br>Student asked to reference the first project. First-project counts (3–12 / 5–13) cannot fill an A2 sheet; this row scales the default wave density (7 marks in ~15% of page height) to the full page. |
| 最小直径 / Min diameter | "Various sizes" | 页宽 3%–7% | 5% | 参考第一次底列圆直径 / Bottom-row circle diameter。 |
| 最大直径 / Max diameter | "Various sizes" | 页宽 14%–26% | 20% | 参考第一次主形尺寸（圆） / Main shape size (circle)。每个圆的直径在最小与最大之间由 seed 抽取。<br>Each circle’s diameter is drawn between min and max using the seed. |
| 相交量 / Intersect amount | "intersect" | 较小形的 15%–45% | 30% | 参考第一次重叠量 / Overlap。这里指轮廓交叉有多深，不是填色遮挡。<br>Analogue of the first-project overlap row, applied to how far outlines cross, not to filled occlusion. |
| 不规则（椭圆长短轴） / Ellipse aspect | "irregular circles" | 1:1–2:1 | 1.5:1 | **推断 / inferred。** 第一次没有「不规则圆」。类比矩形长宽比 1:1–2:1 默认 1.5:1。每个圆的长短轴比在 1 与该值之间抽取。滑到 1:1 则接近正圆，此时「不平行」几乎看不见。<br>No first-project row for irregular circles. Mapped from rectangle aspect ratio. |
| 边缘抖动 / Edge jitter | "irregular circles" | 0%–25% | 8% | **推断 / inferred。请确认。** 第一次没有这一项。两端：0% = 光滑椭圆；25% = 边缘明显起伏。不是第一次的数字。<br>No analogue. Two contrasting ends; default is a guess pending your yes/no. |
| 朝向散布 / Orientation spread | "are not parallel" | 0°–90° | 45° | **推断 / inferred。请确认。** 第一次三角形旋转 −45°–+45°。这里是每个椭圆长轴相对水平线可偏转的最大角度。0° 会让轴平行，违反指令。正圆时旋转几乎看不见。<br>Mapped from triangle rotation range (±45°). Default is a spread, not 0°, because 0° would make axes parallel. |
| 色相 A / Hue A | "three colors" | 0–360° | 8°（闷红 / muted red） | 参考第一次主形三色。 |
| 色相 B / Hue B | "three colors" | 0–360° | 46°（闷黄 / muted yellow） | 参考第一次主形三色。 |
| 色相 C / Hue C | "three colors" | 0–360° | 214°（闷蓝 / muted blue） | 参考第一次主形三色。每个圆由 seed 分到三色之一。<br>Each circle is assigned one of the three hues by the seed. |
| 饱和度 / Saturation | "three colors" | 40%–80% | 58% | 参考第一次主形饱和度。 |
| 明度 / Lightness | "three colors" | 35%–75% | 50% | 参考第一次主形明度。 |
| 线宽 / Line weight | （指令未写 / never mentioned） | 预览 1–6 | 3 | 参考第一次线宽。 |
| 填色或空心 / Fill vs outline | （指令未写 / never mentioned） | `outline` 或 `fill+outline` | **未选定。** 工具暂用 `outline` | **冲突，请你选。** 第一次主形是填色+描边；手绘参考是空心线。指令要求相交可见。填实会盖住交叉。这不是第一次表里的滑杆，是当时的固定决定，不能当默认照搬。<br>Conflict: first project filled the three shapes; the reference drawing is outline-only. Not a ranged parameter in the first table. You must pick. The tool currently shows outline so intersections stay visible — change the switch if you meant fill. |
| 背景 / Background | （指令未写 / never mentioned） | 固定 | 米白 / off-white | 参考第一次背景。 |
| 活区 / Live area | "The canvas is filled" | 固定 | 10 mm 边距以内整块 | 展览条件；指令说铺满。不是滑杆。<br>Exhibition condition; the instruction says the canvas is filled. Not a slider. |
| 种子 / Seed | （工具要求 / required by the tool） | 整数 | 1 | 同一 seed + 同一组滑杆，永远得到同一张图。<br>Same seed plus the same sliders always gives the same drawing. |
| 动物形 / Animal-like | "animal-like shapes can be vaguely seen in the picture" | 不执行为画动物 | 不保证 / not guaranteed | 不是步骤。不画动物。随机相交可能形成你认出来的团块，执行方不能保证能看见动物。<br>Not a drawing procedure. No animals are drawn. Pareidolia is not guaranteed. |

### Version 4 仍须你回答 / still needs a yes or no

- **填色或空心 / Fill vs outline** — 二选一。第一次填色；手绘空心。
- **边缘抖动 8% / Edge jitter 8%** — 第一次没有。要 0%（光滑椭圆）还是要抖动？
- **朝向散布 45° / Orientation spread 45°** — 第一次是三角 ±45°。这个类比成立吗？
- **个数 20–80 默认 47** — 是疏密放大，不是照抄 5–13。若你要更稀或更密，改这一行。

### Version 4 指令未写、第一次也未当作滑杆的

- 动物形的画法 — 定为不画、不保证。
- 页面比例 — 展览规定，不是参数。

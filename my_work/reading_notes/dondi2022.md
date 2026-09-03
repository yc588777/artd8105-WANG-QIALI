---
# Keep this front matter. It is what lets the agent read your whole
# reading corpus at once in Steps 5, 9 and 10.
title: "A gaze-based interactive system to explore artwork imagery"
authors: "Piercarlo Dondi, Marco Porta, Angelo Donvito, Giovanni Volpe"
year: 2022
venue: "Journal on Multimodal User Interfaces"
venue_type: "journal"
doi_or_url: "https://doi.org/10.1007/s12193-021-00373-z"
verified: true
stream: "personal"
topic_tags: []
subconversation: ""
relevance: "core"
date_read:
---

# A gaze-based interactive system to explore artwork imagery

Handwritten source (session 1, by hand): `dondi2022_handwritten.jpg`

## 1 · Why this paper

Your interest in this paper, author or topic. One or two sentences. If it came from a citation chain, say which paper led you here.

## 2 · Summary

手写一页（session 1）的概述：

This paper proposes a gaze-based interactive system for exploring artwork imagery. The system includes a backend tool for experts (Active Area Selector, for defining regions of interest and multimedia content in images) and a frontend application for visitors (Gaze-based Artwork Explorer, GAE, which supports zoom, pan, and triggering of multimedia content through gaze). Experiments show that the system is usable, intuitive, and effective, serving not only as an assistive technology for people with motor impairments but also as a safe alternative to touch screens in museums during the pandemic.

以下按全文结构展开（学生补充）。

**研究背景与动机。** 自 20 世纪 90 年代以来，计算机图形学等技术已用于文化遗产的数字化、修复与展示；近年互动与沉浸式技术（AR、VR、严肃游戏）被用来提升博物馆体验。眼动追踪作为非接触交互，可以吸引观众、为运动障碍者提供无障碍访问，并在疫情期间避免触摸公共屏幕。作者团队 2015 年在「帕维亚战役」展览部署过眼动系统，超过 2000 名访客，验证了可行性，也暴露了教程过长、按钮布局不合理、意外滚动等问题。

**系统目标与架构。** 目标是一套可部署于任何博物馆或展览的灵活系统：专家定义内容，访客用眼动交互。后端包括 ActiveArea Selector（策展人为图像绘制感兴趣区域 / Active Areas，并关联文本、图像、音频、视频；支持多语言与区域分组 Levels）和 Settings Panel（管理员设定颜色、停留时间、缩放速度、区域行为）。前端是 Gaze-based Artworks Explorer (GAE)：选图、缩放、平移、发现并触发活跃区域的多媒体，以及寻找全部活跃区域的游戏化奖励。

**交互流程与设计原则。** 原则：直观、通用、鲁棒。从 Idle（选语言、进主页或教程）到约 90 秒视频教程（相对 2015 版去掉交互操作以缩短学习时间），再到 Home（缩略图选作品）。Visualization 是核心：注视图像约 2 秒出现缩放按钮；缩放后出现四向平移箭头；活跃区域注视时蓝色高亮，首次发现有祝贺与剩余数量，全部发现后显示奖杯；注视后出现播放按钮，弹出多媒体时图像半透明、仅该区域清晰；可用 Levels 切换组别。按钮较大、间距合理以补偿眼动误差；默认停留 1 秒（按钮）或 2 秒（显示缩放）；10 秒检测不到用户则回到 Idle。

**用户研究。** 后端：7 人（5 男 2 女，平均 42 岁），完成打开图像、绘制编辑区域、添加多媒体、保存等，平均 SUS 89.3（A+）。前端：33 人（21 男 12 女，22–71 岁），仅 7 人有眼动经验；任务为选 *Bacchus*（Caravaggio）、缩放到右肩、平移到右手、恢复尺寸、找到 3 个活跃区域并触发内容、回主页。平均 1 分 32 秒（SD 25）；3 人因校准（眼镜或蓝眼睛）约 2.5 分钟，排除后平均 1 分 25 秒（SD 15）。Likert（5 级）：界面直观 4.67，易学 4.79，眼动舒适度 4.09（争议最大），响应 4.18，任务易用 4.82，推荐 4.70，学习效果 4.55，适合博物馆 4.70。作者结论：易学、有效、鲁棒，多数人认为适合博物馆。

**作者的结论与其自述的后续工作。** 完整工作流从内容定义到访客体验；既是运动障碍者的无障碍方案，也是触摸屏的安全替代。前景包括吸引年轻观众、家庭中无法到馆的严重运动障碍者。作者列出的后续：更多眼动仪、新功能、更多实地（含馆内）测试、探索无需校准的版本。

**文中术语（备查）。** Eye tracking：红外检测注视方向。Fixation：相对静止期（100–600 ms）。Saccade：眼跳（短于 100 ms）。Dwell time：注视足够久后触发。Midas Touch：无法区分「看」与「操作」。Active Area：预定义可交互区域。GAE：前端应用。SUS：系统可用性量表。

## 3 · Critical thinking

- **What limitations do you identify?** Beyond the ones the authors concede.
- **Are there problems with the authors' assumptions?**
- **What about applicability, effectiveness and scalability?**

> Generic critique — "small sample," "needs more testing" — scores 2 on the rubric.
> Name a limitation the paper does not concede, or do not write this section.

## 4 · Creative thinking

- **What new ideas did this spark?**
- **Could the method apply to a different problem?**
- **Could you propose a different method for the same problem?**
- **Any other direction this opened?**

## 7 · Take-home

- What did you personally learn?
- What was new to you?
- What can you apply to your own research?
- Is this a good writing sample to imitate structurally? Why?
- Anything else?

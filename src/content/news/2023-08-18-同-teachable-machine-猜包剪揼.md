---
title: "同 Teachable Machine 猜包剪揼"
publishDate: 2023-08-18
description: "介紹如何使用Teachable Machine訓練圖像分類模型玩猜包剪揼遊戲，AI分析手勢特徵進行預測，展示機器學習在圖像識別領域的應用和訓練過程。"
featuredImage: "../../assets/images/news/2023-08-18-同-teachable-machine-猜包剪揼/image1.png"
SEOImage: "../../assets/images/news/2023-08-18-同-teachable-machine-猜包剪揼/image1.png"
category: "文章"
tags: []
author: "kingsumcheung"
---

## 玩法

<div class="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg my-8">
  <iframe 
    src="https://www.youtube.com/embed/lF95T47pKuA" 
    title="同 Teachable Machine 猜包剪揼 - 遊戲玩法"
    class="w-full h-full"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen
  ></iframe>
</div>

1. 按啟動鏡頭
2. 按 玩一回合
3. AI 會首先出示包/剪/揼
4. 系統給你5秒去思考，請向鏡頭出包/剪/揼
5. 勝出者有 10 分
6. 再按玩一回合

[立即試玩](https://play.10botics.com)

在猜拳遊戲中，當我們展示不同的手勢給 Teachable Machine 時，它會分析這些手勢的特徵。特徵可以是手指的位置、手的形狀或其他與手勢相關的屬性。Teachable Machine 會收集這些特徵的數據，並利用這些數據建立起一個模型。

## 訓練自訂模型

<div class="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg my-8">
  <iframe 
    src="https://www.youtube.com/embed/fTCuxVqy7kg" 
    title="訓練自訂模型"
    class="w-full h-full"
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen
  ></iframe>
</div>

1. 到 Teachable Machine 訓練一個 4個類別的圖像分類模型，需按以下名稱分類 ( 0 = 揼 / 1 = 包 / 2 = 剪 / None = 沒有任何指示)
2. 按 Export Model, 選 upload
3. 複制 model 的 URL
4. 在按 啟動鏡頭 前，將上一步 copy 的 URL貼到最頂端的 text box
5. 按 啟動鏡頭
6. 進行遊戲

[Teachable Machine](https://teachablemachine.withgoogle.com/train/image)

這個模型的訓練需要大量的數據，這些數據可以是不同手勢的圖像或視頻。通過訓練，模型可以學習到手勢的共同特徵和差異，從而能夠對新展示的手勢進行準確的預測和分類。

機器學習 (Machine Learning) 的關鍵在於模型的訓練和學習過程。透過大量的數據和適當的算法，模型可以不斷優化和改進，提高對手勢的識別能力。這種基於數據的學習方式讓機器能夠自動從數據中學習，並根據學習到的知識做出預測和決策。

猜拳遊戲只是機器學習的一個簡單應用，而機器學習的應用範圍非常廣泛。它可以應用於圖像辨識、語音識別、自然語言處理等各種領域。例如，機器學習可以幫助我們開發出更準確的人臉辨識系統，讓我們可以通過攝像頭識別和驗證人的身份。它也可以應用於無人駕駛汽車，讓車輛能夠自動辨識和適應不同的交通狀況。

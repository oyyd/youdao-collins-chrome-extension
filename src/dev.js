/* eslint-disable */
import React from 'react'
import ReactDOM from 'react-dom'
import components from './components'

function renderDetail() {
  const { Detail } = components
  const mock = {
    type: 'explain',
    response: {"word":"perform","pronunciation":"/pəˈfɔːm/","frequence":4,"rank":"CET4 TEM4","additionalPattern":"(\n performing,\n performed,\n \t\t\t\t\t\t\t\t\t\t\t\tperforms\n )","meanings":[{"explain":{"type":"V-T","typeDesc":"及物动词","engExplain":"When you <b>perform</b> a task or action, especially a complicated one, you do it. &#x505A;; &#x6267;&#x884C; (&#x5C24;&#x6307;&#x590D;&#x6742;&#x7684;&#x4EFB;&#x52A1;&#x6216;&#x884C;&#x52A8;)"},"example":{"eng":" We're looking for people of all ages who have performed outstanding acts of bravery, kindness, or courage. ","ch":"我们正在寻找各个年龄的、曾有过无畏、善良或英勇之举的杰出人士。"}},{"explain":{"type":"V-T","typeDesc":"及物动词","engExplain":"If something <b>performs</b> a particular function, it has that function. &#x884C;&#x4F7F; (&#x67D0;&#x79CD;&#x529F;&#x80FD;)"},"example":{"eng":" An engine has many parts, each performing a different function. ","ch":"一部发动机有很多部件，各自行使不同的功能。"}},{"explain":{"type":"V-T","typeDesc":"及物动词","engExplain":"If you <b>perform</b> a play, a piece of music, or a dance, you do it in front of an audience. &#x6F14;&#x51FA;; &#x6F14;&#x594F;"},"example":{"eng":" Gardiner has pursued relentlessly high standards in performing classical music. ","ch":"加德纳在演奏古典音乐方面始终不懈地追求高标准。"}},{"explain":{"type":"V-I","typeDesc":"不及物动词","engExplain":"If someone or something <b>performs well</b>, they work well or achieve a good result. If they <b>perform badly</b>, they work badly or achieve a poor result. &#x8868;&#x73B0; (&#x597D;/&#x4E0D;&#x597D;)"},"example":{"eng":" He had not performed well in his exams. ","ch":"过去考试他都考得不好。"}}]}
  }
  // const mock = {"type":"choices","response":{"choices":[{"words":["choice","option"],"wordType":"n."},{"words":["select","choose","elect"],"wordType":"vt."}]}}

  ReactDOM.render(<Detail explain={mock} />, document.getElementById('main'))
}

renderDetail()

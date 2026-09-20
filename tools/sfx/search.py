"""Search mixkit.co free sound effects (no account needed) and list candidates.
usage: python3 search.py <query> [<query> ...]   ->  prints "id | title" per query."""
import sys,re,urllib.request,json
def fetch(q):
    url='https://mixkit.co/free-sound-effects/%s/' % q.replace(' ','-')
    req=urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
    try: h=urllib.request.urlopen(req, timeout=25).read().decode('utf8','ignore')
    except Exception as e: return []
    out=[]
    for b in h.split('data-audio-player-item-id-value="')[1:]:
        iid=b[:b.index('"')]
        t=re.findall(r'item-grid-card__title[^>]*>\s*([^<]+)',b[:4000])
        if t: out.append((iid, t[0].strip()))
    return out
if __name__=='__main__':
    res={}
    for q in sys.argv[1:]:
        r=fetch(q); res[q]=r
        print('==',q)
        for iid,t in r[:14]: print('  ',iid,'|',t)
    json.dump(res,open('candidates.json','w'),indent=1)

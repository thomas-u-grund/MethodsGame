"""Trim, normalise and bundle the downloaded SFX into per-act mp3 bundles + offset table."""
import json,subprocess,os
picks=json.load(open('picks.json'))
os.makedirs('out',exist_ok=True)
ACT2={'sfx-printer','sfx-lamps','sfx-scissors','sfx-stapler','sfx-key','sfx-bell-desk','sfx-drum-spin',
      'sfx-trumpets','sfx-confetti','sfx-klaxon','sfx-scoreboard','sfx-button','sfx-phone-ring',
      'sfx-applause-big','amb-mensa','amb-ward','amb-studio'}
LIMIT={'sfx-printer':4.0,'sfx-klaxon':5.0,'sfx-applause-small':5.0,'sfx-applause-big':5.0,
       'sfx-confetti':4.0,'sfx-trumpets':5.0,'sfx-paper':2.0,'sfx-drum-spin':4.0,'sfx-fall':2.5,
       'amb-office':30,'amb-pond':30,'amb-mensa':40,'amb-ward':20,'amb-clock':20,'amb-studio':40}
for name in picks:
    src=f'raw/{name}.wav'; dst=f'out/{name}.mp3'
    if not os.path.exists(src): continue
    af="silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,loudnorm=I=-20:TP=-2"
    cmd=['ffmpeg','-loglevel','error','-y','-i',src]
    if name in LIMIT: cmd+=['-t',str(LIMIT[name])]
    if name.startswith('amb-'): af+=",afade=t=in:st=0:d=0.6,afade=t=out:st=%s:d=0.8"%(LIMIT.get(name,20)-0.8)
    cmd+=['-af',af,'-ac','1','-ar','44100','-codec:a','libmp3lame','-q:a','5',dst]
    subprocess.run(cmd,check=True)
gap=0.35
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','lavfi','-t',str(gap),'-i','anullsrc=r=44100:cl=mono','/tmp/sgap.wav'],check=True)
man={}
for bundle,members in (('sfx-act1.mp3',[n for n in picks if n not in ACT2]),('sfx-act2.mp3',[n for n in picks if n in ACT2])):
    inputs=[];t=0.0
    for n in members:
        f=f'out/{n}.mp3'
        if not os.path.exists(f): continue
        d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
        man[n]=[bundle,round(t,3),round(d,3)]; inputs+=['-i',f,'-i','/tmp/sgap.wav']; t+=d+gap
    n_in=len(inputs)//2
    fc=''.join(f'[{i}:a]aresample=44100,aformat=channel_layouts=mono[a{i}];' for i in range(n_in))+''.join(f'[a{i}]' for i in range(n_in))+f'concat=n={n_in}:v=0:a=1[out]'
    subprocess.run(['ffmpeg','-loglevel','error','-y',*inputs,'-filter_complex',fc,'-map','[out]','-codec:a','libmp3lame','-q:a','5','../../web/'+bundle],check=True)
    print(bundle, len([m for m in members if m in man]),'clips', round(os.path.getsize('../../web/'+bundle)/1048576,2),'MB')
json.dump(man,open('sfx-manifest.json','w'),indent=1)
print('manifest',len(man))

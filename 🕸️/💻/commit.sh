apps="D:/Workspace"
args="$1"
if [ "$args" = "" ]; then
  args="🖥️/DC"
fi
echo $args 
app="${args%/*}" # "🖥️"
repo="${args##*/}" # "DC"
cd $apps/$app/$repo

git status

printf 'commit (y/n)? '
read answer
if [ "$answer" != "${answer#[Nn]}" ] ;then 
    exit
fi

eval "$(ssh-agent -s)"
status="$(ssh-add -l -E sha256)"
echo $status
if [ -z "${status##*$nokey*}" ]; then
  ssh-add $apps/.ssh/id_rsa
  ssh -T git@github.com
fi
git add .
git commit --all -m "💻" 
git push
    
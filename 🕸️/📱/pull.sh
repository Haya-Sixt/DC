# args
args="$1"
if [ "$args" = "" ]; then
  args="🖥️/DC"
  echo $args
fi

# location
apps="/storage/emulated/0/🍏"
app="${args%/*}"
repo="${args##*/}" 
# constants 
nokey="The agent has no identities"
pass="Your branch is up to date"
success="success"
failure="failure" 

# key
eval "$(ssh-agent -s)"
status="$(ssh-add -l -E sha256)"
echo $status
if [ -z "${status##*$nokey*}" ]; then
  ssh-add $apps/.ssh/id_rsa
  ssh -T git@github.com
fi

# First Strategy
cd $apps/$app/$repo
git fetch --all
git reset --hard 
git pull
status="$(git status)"
echo "--------------"
echo $status
echo "--------------" 
if [ -z "${status##*$pass*}" ]; then
  echo $success
else
  # Second Strategy
  cd $apps/$app
  rm -r $repo
  git clone git@github.com:Haya-Sixt/$repo.git
  cd $repo
  status="$(git status)"
  echo $status
  if [ -z "${status##*$pass*}" ]; then
    echo $success
  else
    echo $failure
  fi
fi

sleep 3s
exit
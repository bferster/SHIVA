cd ../space
echo "Committing VisualEyes:"
msg=$@
git commit -a -m "$msg" 
git push
cd ../shiva
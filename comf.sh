cd ../folio
echo "Committing folio" $@
msg=$@
git commit -a -m "$msg" 
git push
cd ../SHIVA
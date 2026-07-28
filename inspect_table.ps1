$cmd = "docker exec coolify-db psql -U coolify -d ppdb_alimam -c `"\\d nilai_ujian`""
ssh -o StrictHostKeyChecking=no root@72.61.141.50 $cmd > C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\table_desc.txt

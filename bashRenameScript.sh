for f in *; do
    mv -- "$f" "${f%}.mp3"
done

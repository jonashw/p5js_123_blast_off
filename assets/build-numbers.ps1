$INKSCAPE = "`"C:\Program Files\Inkscape\inkscape.exe`""
$width = 400
$numbers = "1", "2", "3"

foreach($n in $numbers){
	$id = "number-$($n)-normal"
	$cmd = "$($INKSCAPE) --export-png=`"$($id).png`" --export-id=$($id) --export-id-only --export-width=$($width) `"123-blast-off.svg`""
	Write-Output $cmd
	cmd.exe /c $cmd
}

$frameCount = 8
foreach($n in $numbers){
	for($i=1; $i -le $frameCount; $i++){
		$id = "number-$($n)-$($i)"
		$cmd = "$($INKSCAPE) --export-png=`"$($id).png`" --export-id=$($id) --export-id-only --export-width=$($width) `"123-blast-off.svg`""
		Write-Output $cmd
		cmd.exe /c $cmd
	}
}
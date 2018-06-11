$INKSCAPE = "`"C:\Program Files\Inkscape\inkscape.exe`""
$width = 50

$frames = 
    "star-01", 
    "star-02", 
    "star-03"

foreach($f in $frames){
	$framePath = "$($f).png"
	$cmd = "$($INKSCAPE) --export-png=`"$($framePath)`" --export-id=$($f) --export-id-only --export-width=$($width) `"123-blast-off.svg`""
	Write-Output $cmd
	cmd.exe /c $cmd
}
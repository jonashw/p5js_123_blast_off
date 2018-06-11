$INKSCAPE = "`"C:\Program Files\Inkscape\inkscape.exe`""
$width = 255

$frames = 
    "rocket-normal", 
    "rocket-burning-01", 
    "rocket-burning-02", 
    "rocket-burning-03", 
    "rocket-burning-04", 
    "rocket-burning-05", 
    "rocket-burning-06";

foreach($f in $frames){
	$framePath = "$($f).png"
	$cmd = "$($INKSCAPE) --export-png=`"$($framePath)`" --export-id=$($f) --export-width=$($width) `"123-blast-off.svg`""
	Write-Output $cmd
	cmd.exe /c $cmd
}
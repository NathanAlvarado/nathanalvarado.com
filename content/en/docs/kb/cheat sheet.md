---
title: "Cheat Sheet"
description: "Common commands"
lead: "Nathan's common commands"
date: 2022-04-06T09:19:42+01:00
lastmod: 2022-08-18T13:57:42+01:00
draft: false
images: []
menu:
  docs:
    parent: "kb"
weight: 630
toc: true
---


## Command Prompt

### Network Commands
Firewall Controls - enable/disable and enable WMI
```
netsh advfirewall set allprofiles state off
netsh advfirewall set allprofiles state on
netsh advfirewall firewall set rule group="windows management instrumentation (wmi)" new enable=yes
```

Enable DHCP Media Sense
```
netsh interface ipv4 set global dhcpmediasense=enabled
```
### System Commands
Reset OneDrive for reindexing
```
%localappdata%\Microsoft\OneDrive\onedrive.exe /reset
```
Run Hyper-V Manager as a different user on a different machine
```
runas /user:SERVER\Administrator /netonly "mmc virtmgmt.msc"
```
Find System Boot Time
```
systeminfo | findstr Time:
```
Take Ownership recursivly
```
takeown /f "c:\example" /r
```
Sync Folders via Robocopy /L for list only /XD to exclude a folder [(more info)](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy)

```
Robocopy.exe C:\Source\ C:\Destination\ /mir /copyall /mot:60 /XD /V “C:\Destination\exclude”
Robocopy.exe C:\Source\ C:\Destination\ /mir /copy:DAT
```

Apply Windows System License

```
slmgr.vbs -ipk XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
```
Adjust Power Settings
```
powercfg.exe -x -monitor-timeout-ac 0
powercfg.exe -x -monitor-timeout-dc 0
powercfg.exe -x -disk-timeout-ac 0
powercfg.exe -x -disk-timeout-dc 0
powercfg.exe -x -standby-timeout-ac 0
powercfg.exe -x -standby-timeout-dc 0
powercfg.exe -x -hibernate-timeout-ac 0
powercfg.exe -x -hibernate-timeout-dc 0
```

### User Commands
Change password, add user, add user to group
```
net user USERNAME *
net user USERNAME PASSWORD /add
net localgroup administrators USERNAME /add
```
View Sessions
```
quser
```
### Chocolatey Commands

Install Chocolatey and Install Office365
```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"

@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -Command "choco install microsoft-office-deployment -y --params="'/64bit /Product:O365BusinessRetail'""
```

## Powershell

Add VPN connection (LT2P with PAP)
```powershell
Add-VpnConnection -Name "VPN Name" -ServerAddress vpn.domain.tld -AllUserConnection -AuthenticationMethod Pap -EncryptionLevel Optional -Force -L2tpPsk "preshared key" -RememberCredential -TunnelType L2tp
```

Replace VPN connection (Split tunnel with designated route and dns suffix, 10.0.0.0/24 network as example)
```powershell
Remove-VpnConnection -Name "VPN Name" -AllUserConnection -Force
Add-VpnConnection -Name "VPN Name" -ServerAddress vpn.domain.tld -AllUserConnection -AuthenticationMethod Pap -EncryptionLevel Optional -Force -L2tpPsk "preshared key" -RememberCredential -TunnelType L2tp -SplitTunneling $true
Add-VpnConnectionRoute -ConnectionName "VPN Name" -DestinationPrefix 10.0.0.0/24
Set-DnsClientGlobalSetting -SuffixSearchList @("domain.local")
```

Test Email (authenticated)
```powershell
$UserCred = get-credential
$fromaddr = Read-Host -Prompt 'From'
$toaddr = Read-Host -Prompt 'To'
$smtpsrv = Read-Host -Prompt 'SMTP Server (smtp.office365.com, smtp.gmail.com, etc.)'
$date = get-date -format g
Send-MailMessage –From $fromaddr –To $toaddr –Subject “Test $date” –Body “Test SMTP Relay Service” -SmtpServer $smtpsrv -Credential $UserCred -UseSsl -Port 587 
```

Remove AppX Package for all users
```powershell
Get-AppxPackage -AllUsers | where-object {$_.name -like "*DisneyMagicKingdoms*"} | Remove-AppxPackage
```
Fix Microsoft Office License Issues
These steps will show you the licenses associated with Office and let you delete all them them so you can start from scratch. VERY HANDY for removing stubborn GracePeriod licenses.

1. Close all Office Apps
2. Open Command Prompt as administrator
3. cd to the OSPP.VBS location (Usually C:\Program Files (x86)\Microsoft Office\Office16)
4. Run cscript ospp.vbs /dstatus - This will show you a list of all Office licenses on the computer
5. Open Powershell ISE as adminstrator
6. Paste and run the following script
```powershell
#Check that the script runs with privileged rights
if (-not([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "You need to have Administrator rights to run this script!`nPlease re-run this script as an Administrator in an elevated powershell prompt!"
    break
}
#Find OSPP.vbs path and run the command with the dstatus option (Last 1...)
$OSPP = Resolve-Path -Path "C:\Program Files*\Microsoft Office\Office16\ospp.vbs" | Select-Object -ExpandProperty Path -Last 1
Write-Output -InputObject "OSPP Location is: $OSPP"
$Command = "cscript.exe '$OSPP' /dstatus"
$DStatus = Invoke-Expression -Command $Command
#Get product keys from OSPP.vbs output.
$ProductKeys = $DStatus | Select-String -SimpleMatch "Last 5" | ForEach-Object -Process { $_.tostring().split(" ")[-1]}
if ($ProductKeys) {
    Write-Output -InputObject "Found $(($ProductKeys | Measure-Object).Count) productkeys, proceeding with deactivation..."
    #Run OSPP.vbs per key with /unpkey option.
    foreach ($ProductKey in $ProductKeys) {
        Write-Output -InputObject "Processing productkey $ProductKey"
        $Command = "cscript.exe '$OSPP' /unpkey:$ProductKey"
        Invoke-Expression -Command $Command
    }
} else {
    Write-Output -InputObject "Found no keys to remove... "
}
```
7. Run the OSPP.vbs script via command prompt again and verify all licenses have been removed.
8. Open regedit and navigate to HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\Common\Identity\Identities
9. Delete all keys in Identities (these generally look like SIDs)
10. Open Credential Manager and select Windows Credentials
11. Delete all MicrosoftOffice16_Data credentials
12. Launch an Office application and login with a licensed account

### Active Directory Powershell

```powershell
Import-Module ActiveDirectory
```

[Get-ADUser](https://docs.microsoft.com/en-us/powershell/module/addsadministration/get-aduser)

```powershell
Get-ADUser USERNAME -Properties PasswordLastSet
```

List Administrative users disaplying their last longon, last time their password was reset and other important info.

```powershell
# Get Members of Administrators group
$groupmembers = Get-ADGroupMember -Identity "Administrators" -Recursive

# Initilize empty array to add members to
$memberarray = @()

# Gather LastLogon and PasswordLastSet details for each member of group and add to an array
foreach ($member in $groupmembers) {
    $memberarray += Get-ADUser -Identity $member.SamAccountName -Properties LastLogon,PasswordLastSet,Enabled,passwordNeverExpires | Select-Object Name,@{Name='LastLogon';Expression={[DateTime]::FromFileTime($_.LastLogon)}},PasswordLastSet,Enabled,passwordNeverExpires
}

# Output Members of group with their last login and password last set values.
Write-Output $memberarray | Sort-Object PasswordLastSet | Format-Table 
```

### Exchange Powershell

DKIM Setup
```powershell
#Get current config
Get-DkimSigningConfig
#Setup and enable new config
New-DkimSigningConfig -DomainName domain.tld -KeySize 2048 -Enabled $true
#Enable existing config
Set-DkimSigningConfig -Identity domain.tld -Enabled $true
```

Export Data and Info
```powershell
#Export Mailbox
New-MailboxExportRequest -Mailbox ttest -FilePath \\localhost\pstfiles\ttest.pst
#Export specific content
New-MailboxExportRequest -contentfilter {(Received -lt '03/15/2018') -and (Received -gt '03/12/2018')} -Mailbox "USER" -FilePath \\localhost\pstExport\user.pst
#Get Export Progress
Get-MailboxExportRequest | Get-MailboxExportRequestStatistics
#Clear Completed Exports
Get-MailboxExportRequest | where {$_.status -eq "Completed"} | Remove-MailboxExportRequest 
```

```powershell
#Create new shared mailbox with specific email address
New-Mailbox -Name "test" -Alias test -Shared -PrimarySmtpAddress test@test.com
#Change Login
Set-Mailbox test -MicrosoftOnlineServicesID test@test.com
```

Increase Mailbox send and receive message size
```powershell
Get-Mailbox | Set-Mailbox -MaxSendSize 75MB -MaxReceiveSize 75MB
Get-MailboxPlan | Set-MailboxPlan -MaxSendSize 75MB -MaxReceiveSize 75MB
```

Mailflow Rules
```powershell
New-TransportRule -Name "Block messages with spammy Unicode" -SubjectOrBodyMatchesPatterns "[\u1D00-\u1D7F]" -FromScope "NotInOrganization" -RejectMessageReasonText "spammer"
```
```powershell
$ruleName = "External Senders with matching Display Names"
$ruleHtml = "<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 align=left width=`"100%`" style='width:100.0%;mso-cellspacing:0cm;mso-yfti-tbllook:1184; mso-table-lspace:2.25pt;mso-table-rspace:2.25pt;mso-table-anchor-vertical:paragraph;mso-table-anchor-horizontal:column;mso-table-left:left;mso-padding-alt:0cm 0cm 0cm 0cm'>  <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes'><td style='background:#910A19;padding:5.25pt 1.5pt 5.25pt 1.5pt'></td><td width=`"100%`" style='width:100.0%;background:#FDF2F4;padding:5.25pt 3.75pt 5.25pt 11.25pt; word-wrap:break-word' cellpadding=`"7px 5px 7px 15px`" color=`"#212121`"><div><p class=MsoNormal style='mso-element:frame;mso-element-frame-hspace:2.25pt; mso-element-wrap:around;mso-element-anchor-vertical:paragraph;mso-element-anchor-horizontal: column;mso-height-rule:exactly'><span style='font-size:9.0pt;font-family: `"Segoe UI`",sans-serif;mso-fareast-font-family:`"Times New Roman`";color:#212121'>This message was sent from outside the company by someone with a display name matching a user in your organization. Please do not click links or open attachments unless you recognize the source of this email and know the content is safe. <o:p></o:p></span></p></div></td></tr></table>"
 
$rule = Get-TransportRule | Where-Object {$_.Identity -contains $ruleName}
$displayNames = (Get-Mailbox -ResultSize Unlimited).DisplayName
 
if (!$rule) {
    Write-Host "Rule not found, creating rule" -ForegroundColor Green
    New-TransportRule -Name $ruleName -Priority 0 -FromScope "NotInOrganization" -ApplyHtmlDisclaimerLocation "Prepend" `
        -HeaderMatchesMessageHeader From -HeaderMatchesPatterns $displayNames -ApplyHtmlDisclaimerText $ruleHtml
}
else {
    Write-Host "Rule found, updating rule" -ForegroundColor Green
    Set-TransportRule -Identity $ruleName -Priority 0 -FromScope "NotInOrganization" -ApplyHtmlDisclaimerLocation "Prepend" `
        -HeaderMatchesMessageHeader From -HeaderMatchesPatterns $displayNames -ApplyHtmlDisclaimerText $ruleHtml
}
```

Disable Exchange SCP (exchange migration/decomissioning)
```powershell
Get-ClientAccessService | Set-ClientAccessService -AutoDiscoverServiceInternalUri $Null
```

## Scripts

Assign everyone to see a new user's calendar and vice versa
```powershell
$newuser = Read-Host -Prompt 'Input the new user email address'
$users = Get-Mailbox
foreach ($user in $users) {
    Add-MailboxFolderPermission -Identity "$($user.Alias):\Calendar" -User "$($newuser)" -AccessRights Reviewer
}
foreach ($user in $users) {
    Add-MailboxFolderPermission -Identity "$($newuser):\Calendar" -User "$($user.Alias)" -AccessRights Reviewer
}
Echo "Completed!"
```

Change default gateway on interface (example: changing 10.0.0.254 to 10.0.0.1)
```powershell
#Find Interface index with 10.0.0.x address
$index = Get-NetIPAddress | Where-object {$_.IPAddress -like "10.0.0.*"} | select -ExpandProperty InterfaceIndex
Get-NetRoute -InterfaceIndex $index -DestinationPrefix 0.0.0.0/0
#Remove old gateway and apply new gateway
Remove-netroute -InterfaceIndex $index -NextHop 10.0.0.254 -DestinationPrefix 0.0.0.0/0 -Confirm:$false; New-NetRoute -InterfaceIndex $index -NextHop 10.0.0.1 -DestinationPrefix 0.0.0.0/0 -Confirm:$false
```

Remove Junk Apps on Windows 10
```powershell
# Get-AppXProvisionedPackage -Online | Select PackageName
$targets = "*XboxApp*", "*BingFinance*", "*BingNews*", "*BingSports*", "*BingWeather*", "*WindowsMaps*", "*ZuneMusic*", "*ZuneVideo*", "*Messaging*"
$targets += "*SkypeApp*", "*MicrosoftOfficeHub*", "*Sway*", "*People*", "*SolitaireCollection*", "*3DBuilder*", "*ConnectivityStore*", "*windowscommunications*"
$targets += "*WindowsCamera*", "*SoundRecorder*", "*Alarms*", "*Office.Desktop*", "*LinkedInforWindows*"

$packages = Get-AppXProvisionedPackage -Online
foreach ($package in $packages)
{
   foreach ($target in $targets)
   {
      if ($package.PackageName -like $target)
      {
         Write-Host "Deprovisioning package: ", $package.DisplayName
         Remove-AppXProvisionedPackage -Online -PackageName $package.PackageName
      }
   }
}

# Get-AppXPackage -AllUsers | Select PackageFullName


# list of application names to remove -- USE WILDCARD
$names = "*CandyCrush*", "*Sway*", "*3DBuilder*", "*ZuneVideo*", "*Advertising*", "*WindowsMaps*", "*SolitaireCollection*", "*XboxApp*"
$names += "*BingSports*", "*BingWeather*", "*ConnectivityStore*", "*BingFinance*", "*BingNews*", "*ZuneMusic*", "*Messaging*", "*Twitter*"
$names += "*SkypeApp*", "*OfficeHub*", "*windowscommunications*", "*WindowsCamera*", "*SoundRecorder*", "*Alarms*"
$names += "*DisneyMagicKingdoms*", "*MarchofEmpires*", "*HiddenCity*", "*Minecraft*", "*king.com*", "*Office.Desktop*"
$names += "*Print3D*", "*DolbyAccess*", "*RemoteDesktop*"
$apps = Get-AppXPackage -AllUsers
foreach ($app in $apps)
{
   foreach ($name in $names)
   {
      if ($app.Name -like $name)
      {
         Write-Host "Removing app: ", $app.Name
         Remove-AppXPackage -Package $app
      }
   }
}
```

## Registry Edits

Disable Chrome renderer code integrity (fix "Aw Snap!" message)
```
REG ADD "HKLM\Software\Policies\Google\Chrome" /v RendererCodeIntegrityEnabled /t REG_DWORD /d 0
```

List of preview handlers
```
Computer\HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\PreviewHandlers
```

Change Preview handler (.pdf)
```
Computer\HKEY_CLASSES_ROOT\.pdf\ShellEx\{8895b1c6-b41f-4c1c-a562-0d564250836f}
```

Remove following keys to fix MS Word preview handler
```
Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Classes\CLSID\{00020827-0000-0000-C000-000000000046}
Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Classes\CLSID\{65235197-874B-4A07-BDC5-E65EA825B718}
Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Classes\CLSID\{84F66100-FF7C-4fb4-B0C0-02CD7FB668FE}
```

Enable IP Routing for VPN Server
```
Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\IPEnableRouter
```


## SSH

Tunnel RDP
```
ssh -N -L 13389:10.0.0.1:3389 user@location
```

(function () {
'use strict';
var module = angular.module('fim.base');
module.controller('ExchangePluginMarketsController', function($scope, $sce) {

  /* The headsup array contains a maximum of 12 items 1 for each bootstrap grid colum */
  var names = 'mgwBTC,SuperNET,NEMstake,Nxttycoin,FunBotV2,CCNXT,NxtMnth914,EVOLVE,ORA,theRealDAX,TOKEN,NSC,silver,MIC,EVOLVE2,NXTEUR,mgwBTC,NXTGrid,EnergyGHS,NXTP,ShortBTCD,HackerXCHG,Micro,Diggers,UKGOVLOTTO,JoyBits,NxtMnth714,DroneMine,NXTTXTFund,NXTMetalAu,CNTROPOLIS,Ethereum,QORA,CCC,CBOOKING,UNITY,NXTgenMine,ShortUNITY,Supercell,mgwBC,BLACKBEAN,NxtRoad,NXTdrop,Coinshop,JAFFA,XDFB,nXtGenGHS,NAV,nXtGenKHS,SBSFund,ForgeCoin,Nxttycoins,ShortBTC,NXTautoDAC,NxtMania,mgwLTC,CUnlimited,PTS,LAND,topDISTR,bcmultiply,mgwDOGE,badPonzi,LOVE,MegaLotto,mgwVIA,nxtchange,MPFiatGate,jesus,NXT24,Apple,GiftCards,NXTinvest,Vircurex,ALTCHAIN,HouseMusic,NXTLottery,kicalchen,DBTC';
  angular.forEach(names.split(','), function (name) {
    $scope.assets.push({
      name: name,
      price: roundNum(((Math.random() * (50000-0.000001))+0.000001), 8),
      diff: renderPercent(Math.floor(((Math.random() * (1000 - (-250)))+(-250))))
    })
  });

  /** 
   * Rounds a number allowing it to only consist of maxcharacters when 
   * displayed. Based on the number of digits before the decimal point
   * we decide how many digits we can have beyond the decimal point
   * so eventually the entire number will be no more than maxcharacters
   * in length.
   *
   * @param number
   * @param maxcharacters
   * @return String (trusted HTML)
   **/
  function roundNum(number, maxcharacters) {
    var str = String(number);
    if (str.indexOf('.') == -1) {
      return str;
    }
    var parts = str.split('.');
    var remain = maxcharacters - parts[0].length - 1;
    if (remain == 0) {
      return renderPrice(parts[0]);
    }
    return renderPrice(parts[0], parts[1].substring(0,remain));
  } 


  function renderPrice(whole, remainder) {
    var html = '<span style="font-size: 20px">'+whole+'</span>';
    if (remainder) {
      return $sce.trustAsHtml(html + '<span style="font-size: 14px">.'+remainder+'</span>');
    }
    return $sce.trustAsHtml(html);
  }

  function renderPercent(number) {
    var color = number>0?'green':'red';
    return $sce.trustAsHtml('<span class="text-left" style="color:'+color+'">'+number+'%</span>');
  }



});
})();
//
angular.module('andes.controllers', [])


.controller('DetalleCtrl', function($scope, $state, $rootScope, $ionicHistory, $localStorage, $location, $ionicModal, $timeout, $interval, $ionicLoading, $ionicPopup, $stateParams) {


})
.controller('HomeCtrl', function($scope, $state, $rootScope, $localStorage, $location, $timeout, $ionicLoading, $ionicPopup) {
  $rootScope.esperando = 0;
  $scope.$on('$ionicView.enter', function(obj, viewData){
    $scope.TipoRespuesta = 0;
    $scope.cabeza = null;
    $scope.CanEndEtapa1 = 0;
    $scope.bultos = [];
    $scope.facturas = [];
    $scope.abiertos = 0;
    $scope.abiertosEntrega = 0;
    $scope.facturasAbiertos = 0;
    $scope.NroPedido = "";
    if (viewData.direction == 'back') {
      // events on back to home
    }
  });

  $scope.$on('$ionicView.beforeLeave', function(obj, viewData){

  }); 


  $scope.fake = function() {
    var lambda = prompt('Ingresa código de barra','005887180029');
    $rootScope.$broadcast('scanner', { data: { success: true, data: lambda } });
  };
  $scope.ubicar = function() {
   $rootScope.esperando = 1;
   var confirmPopup = $ionicPopup.confirm({
     title: 'Ubicar',
     template: 'Esperando ubicacion',
     buttons: [
      {
        text: '<b>CANCELAR</b>',
        type: 'button-assertive',
        onTap: function(e) {
          $("body").removeClass("modal-open");
          $rootScope.esperando = 0;
        }
      },
      /*
      {
        text: '<b>MANOPLA</b>',
        type: 'button-assertive',
        onTap: function(e) {
          $("body").removeClass("modal-open");
          var lambda = prompt('Ingresa código de barra','');
          $rootScope.$broadcast('scanner', { data: { success: true, data: lambda } });

        }
      },*/
     ]
    });

  }
  $scope.endEtapa = function(IDEtapa,IDEstado) {
    $rootScope.confirmar("¿Estás seguro de terminar?", function() { 
      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
      $rootScope.showload();
      jQuery.post($localStorage.app.rest+"/despachadores.php?op=actualizarEstado", { 
        IDOperacion: $scope.cabeza.IDOperacion, 
        AnnoProceso: $scope.cabeza.AnnoProceso,
        Correlativo: $scope.cabeza.Correlativo,
        IDEstado: IDEstado,
        IDEtapa: IDEtapa,
        IDSacador: $rootScope.despachador.IDSacador,
        IDUsuario: $rootScope.despachador.szUsuario
      }, function(data) {
        $rootScope.hideload();
        if (data.res == "ERR") {
          if (window.cordova) { navigator.notification.beep(1); }
          $rootScope.err(data.msg, function() {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $scope.cabeza = null;
          $scope.bultos = [];
          $scope.facturas = [];
          $scope.TipoRespuesta = 0;
          $scope.CanEndEtapa1 = 0;
        }
      },"json").fail(function() {
        $rootScope.hideload();
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        $rootScope.err("Elemento no es accesible");
      });
    }, function() {
      // no terminar
      if (IDEtapa == 6) {
        $rootScope.showload();
        jQuery.post($localStorage.app.rest+"/despachadores.php?op=actualizarEstado", { 
          IDOperacion: $scope.cabeza.IDOperacion, 
          AnnoProceso: $scope.cabeza.AnnoProceso,
          Correlativo: $scope.cabeza.Correlativo,
          IDEstado: 0,
          IDEtapa: 17,
          IDSacador: $rootScope.despachador.IDSacador,
          IDUsuario: $rootScope.despachador.szUsuario
        }, function(data) {
          $rootScope.hideload();
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        },"json").fail(function() {
          $rootScope.hideload();
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $rootScope.err("Elemento no es accesible");
        });
      }
    });
  };
  $scope.cancelarEtapa = function(IDEtapa) {

    $rootScope.confirmar("Se eliminará lo que has registrado hasta el momento. ¿Estás seguro?", function() { 
      if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
      $rootScope.showload();
      jQuery.post($localStorage.app.rest+"/despachadores.php?op=actualizarEstado", { 
        IDOperacion: $scope.cabeza.IDOperacion, 
        AnnoProceso: $scope.cabeza.AnnoProceso,
        Correlativo: $scope.cabeza.Correlativo,
        IDEstado: 0,
        IDEtapa: IDEtapa,
        IDSacador: $rootScope.despachador.IDSacador,
        IDUsuario: $rootScope.despachador.szUsuario
      }, function(data) {
        $rootScope.hideload();
        if (data.res == "ERR") {
          if (window.cordova) { navigator.notification.beep(1); }
          $rootScope.err(data.msg, function() {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          });
        }
        else {
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          
          $scope.cabeza = null;
          $scope.bultos = [];
          $scope.facturas = [];
          $scope.TipoRespuesta = 0;
          $scope.CanEndEtapa1 = 0;
        }
      },"json").fail(function() {
        $rootScope.hideload();
        if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
        $rootScope.err("Elemento no es accesible");
      });
    });
  };

  $scope.$on('scanner', function(event, args) {
    console.log('scanner listener', args);
    if (args.hasOwnProperty("data") && args.data.success == true) {
      

      
      if ($rootScope.esperando == 1) {

        if (args.data.data.length == 4) {
          $rootScope.esperando = 0;
          if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
          $rootScope.showload();

          jQuery.post($localStorage.app.rest+"/despachadores.php?op=leerCodigo", { 
            NroPedido: $scope.NroPedido, 
            CodigoBarras: args.data.data,
            IDUsuario: $rootScope.despachador.szUsuario,
            TipoConsulta: 6
          }, function(data) {
            $rootScope.hideload();
            if (data.res == "ERR") {
              if (window.cordova) { navigator.notification.beep(1); }
              $rootScope.err(data.msg, function() {
                if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
              });
            }
            else {
              $scope.endEtapa(6,5);
            }
          },"json").fail(function() {
            $rootScope.hideload();
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            $rootScope.err("Elemento no es accesible");
          });

        }
        else {
          $rootScope.err("CODIGO DE UBICACION NO CORRESPONDE, REINTENTE");
        }

      }
      else {


        if (($scope.TipoRespuesta == 2 && args.data.data.substring(0,1) != "F")) {
          if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
          if (window.cordova) { navigator.notification.beep(1); }
          $rootScope.err("Tienes facturas pendientes por recaudar", function() {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          });
        }
        else {

        if (window.cordova) { window.cordova.plugins.honeywell.disableTrigger(() => console.info('trigger disabled')); }
        $rootScope.showload();

        jQuery.post($localStorage.app.rest+"/despachadores.php?op=leerCodigo", { 
          NroPedido: $scope.NroPedido, 
          CodigoBarras: args.data.data,
          IDUsuario: $rootScope.despachador.szUsuario,
          TipoConsulta: $scope.TipoRespuesta
        }, function(data) {
          $rootScope.hideload();
          if (data.res == "ERR") {
            if (window.cordova) { navigator.notification.beep(1); }
            $rootScope.err(data.msg, function() {
              if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            });
          }
          else {
            if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
            
            $scope.TipoRespuesta = data.tipo;
            $scope.bultos = data.bultos;
            $scope.cabeza = data.cabeza;
            $scope.facturas = data.facturas;
            $scope.CanEndEtapa1 = 0;
            $scope.abiertos = 0;
            $scope.abiertosEntrega = 0;
            $scope.facturasAbiertos = 0;
            $scope.NroPedido = $scope.cabeza.NroDocumento;
            /* Bultos */
            var abiertos = 0;      
            for ( var i = 0 ; i < $scope.bultos.length ; i++ ) {
              if ($scope.bultos[i].IDEstado == 1) {
                abiertos++;
              }
            }
            if (abiertos == 0) {
              $scope.CanEndEtapa1 = 1;
            }
            /* Facturas */
            var facturasAbiertos = 0;
            for ( var i = 0 ; i < $scope.facturas.length ; i++ ) {
              if ($scope.facturas[i].SiEntregada == 0) {
                facturasAbiertos++;
              }
            }

            var abiertosEntrega = 0;
            for ( var i = 0 ; i < $scope.bultos.length ; i++ ) {
              if ($scope.bultos[i].IDEstado < 3) {
                abiertosEntrega++;
              }
            }

            $scope.abiertos = abiertos;
            $scope.facturasAbiertos = facturasAbiertos;
            $scope.abiertosEntrega = abiertosEntrega;
            
            if (data.tipo == 1) {

            }
          }
        },"json").fail(function() {
          $rootScope.hideload();
          if (window.cordova) { window.cordova.plugins.honeywell.enableTrigger(() => console.info('trigger enabled')); }
          $rootScope.err("Elemento no es accesible");
        });


        }


      }


    }
  });

})


.controller('MainCtrl', function($scope, $state, $localStorage, $timeout, $interval, $ionicModal, $rootScope, $location, $ionicLoading, $ionicSideMenuDelegate) {

  $ionicSideMenuDelegate.canDragContent(false);

  $rootScope.despachadores = [];

  // Start controller

  $ionicModal.fromTemplateUrl('templates/config.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalConfiguracion = modal;
  });


  $scope.start = function(x) {
    if (!x) { var x = 0; }

    if (!$localStorage.despachador || x == 1) {
      setTimeout(function() { 
        $scope.modalConfiguracion.show();
        $rootScope.showload();
        jQuery.post($localStorage.app.rest+"/despachadores.php?op=getDespachadores", { }, function(data) {
          $rootScope.hideload();
          if (data.res == "OK") {
            $rootScope.despachadores = data.data;
          } else {
            $rootScope.err(data.msg);  
          }
        },"json").fail(function(xhr) {
          $rootScope.hideload();
          $rootScope.err(xhr.responseText);
        });
      },500);
    }
    else {
      $rootScope.app = $localStorage.app;
      if ($localStorage.despachador) {
        $rootScope.despachador = $localStorage.despachador;
      }
    }
  }

  $scope.start();

  $scope.setDespachador = function(despachador) {
    $rootScope.despachador = despachador;
  }
  $scope.confirmDespachador = function() {
    if ($rootScope.hasOwnProperty("despachador") && $rootScope.despachador.hasOwnProperty("szUsuario")) {
      $rootScope.confirmar('¿Deseas dejar configurado este equipo para el despachador '+$rootScope.despachador.NombreSacador+'?', function() {
        $localStorage.despachador = $rootScope.despachador;
        $scope.modalConfiguracion.hide();
        $scope.start();
      });
    } else {
      $rootScope.err("Debes seleccionar un sacador");
    }
  }
})

String.prototype.toBytes = function() {
    var arr = []
    for (var i=0; i < this.length; i++) {
    arr.push(this[i].charCodeAt(0))
    }
    return arr
}

function miles(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}
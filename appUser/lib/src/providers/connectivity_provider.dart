import 'package:connectivity_plus/connectivity_plus.dart'
    show Connectivity, ConnectivityResult;
import 'package:flutter_riverpod/flutter_riverpod.dart'
    show Notifier, NotifierProvider;
import '../core/utils/constants.dart' show ConnectivityStatus;

//globally accessible
final connectivityStatusProvider =
    NotifierProvider<ConnectivityStatusNotifier, ConnectivityStatus>(
  ConnectivityStatusNotifier.new,
);

class ConnectivityStatusNotifier extends Notifier<ConnectivityStatus> {
  @override
  ConnectivityStatus build() {
    state = ConnectivityStatus.notDetermined;
    Connectivity()
        .onConnectivityChanged
        .listen(
          (List<ConnectivityResult> results) {
            // Use the first result if available, otherwise assume disconnected
            final result = results.isNotEmpty
                ? results.first
                : ConnectivityResult.none;
            state = _mapConnectivityResultToStatus(result);
          },
        );
    return state;
  }

  ConnectivityStatus _mapConnectivityResultToStatus(ConnectivityResult result) {
    switch (result) {
      case ConnectivityResult.mobile:
      case ConnectivityResult.wifi:
      case ConnectivityResult.vpn:
      case ConnectivityResult.bluetooth:
      case ConnectivityResult.ethernet:
      case ConnectivityResult.other:
        return ConnectivityStatus.isConnected;
      case ConnectivityResult.none:
        return ConnectivityStatus.isDisconnected;
    }
  }
}

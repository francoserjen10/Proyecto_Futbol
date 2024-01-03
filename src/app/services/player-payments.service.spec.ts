import { TestBed } from '@angular/core/testing';

import { PlayerPaymentsService } from './player-payments.service';

describe('PlayerPaymentsService', () => {
  let service: PlayerPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
